# Automation System Setup Guide for Supabase

This guide explains how the automation system works and how to integrate it with your Supabase backend.

## 🎯 Overview: How Automations Work

The automation system has three main components:

### 1. **Workflow Engine** - Orchestrates business logic
- Receives triggers (appointment created, support ticket submitted, etc.)
- Executes a series of tasks in sequence
- Handles errors and logs results
- Manages data flow between tasks

### 2. **Task Scheduler** - Executes tasks at scheduled times
- Runs in background (async)
- Checks for due tasks every second
- Handles retries on failure
- Tracks execution history

### 3. **Services** - Handle external communications
- **EmailService**: Sends emails via SMTP
- **SMSService**: Sends SMS via Twilio API

---

## 📊 Architecture Diagram

```
User Creates Appointment in Website
           ↓
   Browser sends data to API
           ↓
API saves to Supabase Database
           ↓
Supabase Webhook triggers Edge Function
           ↓
Edge Function invokes Python automation
           ↓
Workflow Engine executes tasks:
  ├─ Task 1: Send confirmation email
  ├─ Task 2: Update loyalty points in DB
  ├─ Task 3: Notify staff
           ↓
Scheduler monitors for reminders
           ↓
Scheduler runs at scheduled times:
  ├─ 24 hours before: Send reminder email
  ├─ 2 hours before: Send SMS reminder
  ├─ 3 days after: Send follow-up email
           ↓
Results logged and stored in Supabase
```

---

## 🔧 Step-by-Step Integration with Supabase

### Step 1: Create Database Tables

First, create tables in your Supabase database to track automations:

```sql
-- Workflow executions table
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name TEXT NOT NULL,
    status TEXT NOT NULL, -- pending, running, completed, failed
    customer_id UUID REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    context JSONB, -- Store workflow context
    results JSONB, -- Store execution results
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Scheduled tasks table
CREATE TABLE scheduled_tasks (
    id TEXT PRIMARY KEY,
    task_name TEXT NOT NULL,
    schedule_type TEXT NOT NULL, -- once, daily, weekly, monthly, interval
    execute_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_executed TIMESTAMP,
    next_execution TIMESTAMP,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email logs table
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL, -- sent, failed, pending
    workflow_execution_id UUID REFERENCES workflow_executions(id),
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- SMS logs table
CREATE TABLE sms_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL, -- sent, failed, pending
    workflow_execution_id UUID REFERENCES workflow_executions(id),
    error_message TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Appointment reminders table
CREATE TABLE appointment_reminders (
    id TEXT PRIMARY KEY,
    appointment_id UUID REFERENCES appointments(id) NOT NULL,
    customer_id UUID REFERENCES patients(id) NOT NULL,
    reminder_minutes_before INT NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, sent, failed, cancelled
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 2: Create Supabase Edge Function for Webhooks

Create a new Edge Function to handle appointment creation webhooks:

```bash
# Create edge function
supabase functions new handle-appointment-created
```

In `supabase/functions/handle-appointment-created/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AppointmentEvent {
  appointment_id: string;
  customer_id: string;
  service_type: string;
  scheduled_time: string;
  duration_minutes: number;
}

serve(async (req: Request) => {
  try {
    const event: AppointmentEvent = await req.json();

    // 1. Log workflow execution start
    const { data: execution } = await supabase
      .from("workflow_executions")
      .insert({
        workflow_name: "AppointmentScheduled",
        status: "running",
        customer_id: event.customer_id,
        appointment_id: event.appointment_id,
        context: event,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    // 2. Get customer details
    const { data: customer } = await supabase
      .from("patients")
      .select("*")
      .eq("id", event.customer_id)
      .single();

    // 3. Call Python automation via HTTP
    const automationResponse = await fetch("http://localhost:8000/api/workflows/appointment-scheduled", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          id: customer.id,
          name: customer.full_name,
          email: customer.email,
          phone: customer.phone,
        },
        appointment: event,
        execution_id: execution.id,
      }),
    });

    const automationResult = await automationResponse.json();

    // 4. Update workflow execution with results
    await supabase
      .from("workflow_executions")
      .update({
        status: automationResult.success ? "completed" : "failed",
        results: automationResult,
        completed_at: new Date().toISOString(),
      })
      .eq("id", execution.id);

    // 5. Schedule reminders
    const appointmentTime = new Date(event.scheduled_time);
    
    // 24-hour reminder
    const reminder24h = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000);
    await supabase.from("appointment_reminders").insert({
      id: `reminder_${event.appointment_id}_24h`,
      appointment_id: event.appointment_id,
      customer_id: event.customer_id,
      reminder_minutes_before: 1440,
      scheduled_time: reminder24h.toISOString(),
    });

    // 2-hour reminder
    const reminder2h = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000);
    await supabase.from("appointment_reminders").insert({
      id: `reminder_${event.appointment_id}_2h`,
      appointment_id: event.appointment_id,
      customer_id: event.customer_id,
      reminder_minutes_before: 120,
      scheduled_time: reminder2h.toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, execution_id: execution.id }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

### Step 3: Create Python FastAPI Server

Create a server to run the automation workflows:

```python
# automation/api_server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import asyncio
import logging
from datetime import datetime
from workflow_engine import (
    WorkflowEngine, Customer, Appointment, AppointmentStatus,
    EmailService, SMSService
)
from scheduler import TaskScheduler, ReminderScheduler

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
email_service = EmailService(
    smtp_server="smtp.gmail.com",
    smtp_port=587,
    sender_email="your_email@gmail.com",
    sender_password="your_app_password"
)

sms_service = SMSService(
    api_key="your_twilio_api_key"
)

workflow_engine = WorkflowEngine()
workflow_engine.email_service = email_service
workflow_engine.sms_service = sms_service

scheduler = TaskScheduler()
reminder_scheduler = ReminderScheduler(scheduler, workflow_engine)

logger = logging.getLogger(__name__)


class CustomerData(BaseModel):
    id: str
    name: str
    email: str
    phone: str


class AppointmentData(BaseModel):
    appointment_id: str
    customer_id: str
    service_type: str
    scheduled_time: str
    duration_minutes: int


class WorkflowRequest(BaseModel):
    customer: CustomerData
    appointment: AppointmentData
    execution_id: Optional[str] = None


@app.on_event("startup")
async def startup():
    """Start scheduler on app startup"""
    await scheduler.start()
    logger.info("Scheduler started")


@app.on_event("shutdown")
async def shutdown():
    """Stop scheduler on app shutdown"""
    await scheduler.stop()
    logger.info("Scheduler stopped")


@app.post("/api/workflows/appointment-scheduled")
async def handle_appointment_scheduled(request: WorkflowRequest):
    """
    Handle new appointment scheduling
    This is called by Supabase webhook
    """
    try:
        # Create customer object
        customer = Customer(
            id=request.customer.id,
            name=request.customer.name,
            email=request.customer.email,
            phone=request.customer.phone,
            created_at=datetime.now()
        )
        workflow_engine.add_customer(customer)

        # Create appointment object
        appointment = Appointment(
            id=request.appointment.appointment_id,
            customer_id=request.appointment.customer_id,
            service_type=request.appointment.service_type,
            scheduled_time=datetime.fromisoformat(request.appointment.scheduled_time),
            duration_minutes=request.appointment.duration_minutes,
            status=AppointmentStatus.SCHEDULED
        )
        workflow_engine.add_appointment(appointment)

        # Execute appointment workflow
        result = await workflow_engine.schedule_appointment_workflow(
            customer, appointment, email_service
        )

        return {
            "success": result['status'] == 'completed',
            "workflow_id": request.execution_id,
            "result": result
        }

    except Exception as e:
        logger.error(f"Error handling appointment: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


@app.post("/api/reminders/send")
async def send_appointment_reminder(appointment_id: str, customer_id: str, hours_before: int = 24):
    """
    Send appointment reminder
    This is called by scheduler
    """
    try:
        customer = workflow_engine.customers.get(customer_id)
        appointment = workflow_engine.appointments.get(appointment_id)

        if not customer or not appointment:
            return {"success": False, "error": "Customer or appointment not found"}

        result = await workflow_engine.schedule_reminder_workflow(
            customer, appointment, email_service, sms_service, hours_before
        )

        return {
            "success": result['status'] == 'completed',
            "result": result
        }

    except Exception as e:
        logger.error(f"Error sending reminder: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


@app.get("/api/statistics")
async def get_statistics():
    """Get system statistics"""
    return workflow_engine.get_statistics()


@app.get("/api/workflows/history")
async def get_workflow_history():
    """Get workflow execution history"""
    return workflow_engine.get_workflow_history()


@app.get("/api/tasks/status")
async def get_tasks_status():
    """Get all scheduled tasks status"""
    return scheduler.get_all_tasks_status()


@app.post("/api/scheduler/start")
async def start_scheduler():
    """Manually start scheduler"""
    if not scheduler.running:
        await scheduler.start()
    return {"success": True, "message": "Scheduler started"}


@app.post("/api/scheduler/stop")
async def stop_scheduler():
    """Manually stop scheduler"""
    if scheduler.running:
        await scheduler.stop()
    return {"success": True, "message": "Scheduler stopped"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Step 4: Set Up Supabase Webhooks

In Supabase Dashboard:

1. Go to **Database** → **Webhooks**
2. Click **Create webhook**
3. Configure:
   - **Name**: `appointment-created`
   - **Table**: `appointments`
   - **Events**: `INSERT`
   - **HTTP Request**:
     - Method: `POST`
     - URL: `http://your-server.com/api/webhooks/appointment-created`
     - Headers: Add `Authorization: Bearer your_webhook_secret`

---

## 📧 How Auto-Generated Emails Work

### Email Generation Flow

```
Workflow Engine
      ↓
EmailService.send_appointment_confirmation()
      ↓
Creates HTML email using template
      ↓
Connects to SMTP server (Gmail, SendGrid, etc.)
      ↓
Sends email
      ↓
Logs result in email_logs table
```

### Email Templates

The system includes pre-built templates:

```python
# Appointment Confirmation Email
def send_appointment_confirmation(self, customer: Customer, appointment: Appointment) -> bool:
    """
    Sends:
    - Customer name
    - Service type
    - Date and time
    - Duration
    - Dentist name
    - Cancellation instructions
    """
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Appointment Confirmation</h2>
            <p>Dear {customer.name},</p>
            <ul>
                <li>Service: {appointment.service_type}</li>
                <li>Date & Time: {appointment.scheduled_time}</li>
                <li>Duration: {appointment.duration_minutes} minutes</li>
            </ul>
        </body>
    </html>
    """
```

### Customizing Email Templates

Edit `workflow_engine.py` to customize templates:

```python
# Example: Add custom HTML template
custom_confirmation_template = """
<html>
    <body style="background-color: #f5f5f5; font-family: Arial;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px;">
            <h2 style="color: #007bff;">Welcome to Makhanda Smiles</h2>
            <p>Dear {customer_name},</p>
            <p>Your appointment has been confirmed!</p>
            <!-- Add your custom content here -->
        </div>
    </body>
</html>
"""
```

---

## 📅 How Appointment Scheduling & Reminders Work

### Reminder Scheduling Timeline

```
Appointment Created: Jan 15, 10:00 AM
         ↓
Edge Function triggered
         ↓
Scheduler creates reminders:
  ├─ Jan 14, 10:00 AM (24h before) - Email reminder
  ├─ Jan 15, 8:00 AM (2h before) - SMS reminder
         ↓
Scheduler runs every second
         ↓
At Jan 14 10:00 AM: Send 24h email
At Jan 15 8:00 AM: Send 2h SMS
```

### Reminder Configuration

```python
# In Edge Function (index.ts)

// Schedule 24-hour reminder
await supabase.from("appointment_reminders").insert({
    id: `reminder_${appointment_id}_24h`,
    reminder_minutes_before: 1440, // 24 hours in minutes
    scheduled_time: reminder24h,
});

// Schedule 2-hour reminder
await supabase.from("appointment_reminders").insert({
    id: `reminder_${appointment_id}_2h`,
    reminder_minutes_before: 120, // 2 hours in minutes
    scheduled_time: reminder2h,
});

// Schedule 3-day follow-up
await supabase.from("follow_ups").insert({
    id: `followup_${appointment_id}_3d`,
    days_after: 3,
    scheduled_time: followup3d,
});
```

### Follow-up Scheduling

```python
# In scheduler.py

async def schedule_follow_up(self, appointment_id, customer_id, days_after=3):
    """
    Called after appointment is completed
    Sends follow-up email 3 days later
    """
    follow_up_time = appointment.scheduled_time + timedelta(days=days_after)
    
    task = ScheduledTask(
        id=f"followup_{appointment_id}_{days_after}d",
        callback=send_follow_up_email,
        schedule_type=ScheduleType.ONCE,
        execute_at=follow_up_time
    )
    scheduler.add_task(task)
```

---

## 🚀 Running the Complete System

### Step 1: Install Dependencies

```bash
pip install fastapi uvicorn python-dotenv aiosmtplib
```

### Step 2: Create `.env` File

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password

# Twilio SMS
TWILIO_API_KEY=your_twilio_api_key
TWILIO_API_URL=https://api.twilio.com

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

# Server
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
```

### Step 3: Run the Server

```bash
cd automation
python -m uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload
```

Output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
INFO:     Scheduler started
```

### Step 4: Test the Workflow

```python
# test_workflow.py
import requests
import json

url = "http://localhost:8000/api/workflows/appointment-scheduled"

payload = {
    "customer": {
        "id": "cust_001",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+27791234567"
    },
    "appointment": {
        "appointment_id": "apt_001",
        "customer_id": "cust_001",
        "service_type": "Teeth Cleaning",
        "scheduled_time": "2025-01-15T10:00:00",
        "duration_minutes": 60
    }
}

response = requests.post(url, json=payload)
print(json.dumps(response.json(), indent=2))
```

---

## 🔄 Complete Workflow Example

### 1. User Books Appointment on Website

```
User fills booking form → Frontend validates → Sends to API
```

### 2. API Saves to Supabase

```sql
INSERT INTO appointments (customer_id, service_type, scheduled_time, ...)
VALUES ('cust_001', 'Teeth Cleaning', '2025-01-15T10:00:00', ...);
```

### 3. Supabase Webhook Triggers

```typescript
// Webhook sent to Edge Function
POST /api/webhooks/appointment-created
{
  "appointment_id": "apt_001",
  "customer_id": "cust_001",
  "service_type": "Teeth Cleaning",
  "scheduled_time": "2025-01-15T10:00:00",
  "duration_minutes": 60
}
```

### 4. Edge Function Calls Python API

```typescript
fetch("http://localhost:8000/api/workflows/appointment-scheduled", {
  method: "POST",
  body: JSON.stringify(request)
})
```

### 5. Python Workflow Executes

```
Task 1: Send confirmation email
  ├─ Get customer email
  ├─ Generate HTML from template
  ├─ Send via SMTP
  └─ Log in email_logs table

Task 2: Update loyalty points
  ├─ Calculate points (e.g., 10 points per R100)
  ├─ Update patients table
  └─ Log in workflow_executions

Task 3: Notify staff
  ├─ Get staff email
  ├─ Send appointment details
  └─ Log notification
```

### 6. Reminders Scheduled

```
Scheduler adds to scheduled_tasks:
  ├─ 24h before: Send email reminder
  ├─ 2h before: Send SMS reminder
  └─ 3d after: Send follow-up
```

### 7. Scheduled Time Arrives

```
Scheduler checks every second
  ├─ 24h before appointment:
  │   └─ Send "Your appointment is tomorrow" email
  │
  ├─ 2h before appointment:
  │   └─ Send "Appointment in 2 hours" SMS
  │
  └─ 3 days after appointment:
      └─ Send "How was your visit?" follow-up
```

### 8. Results Tracked

```
Database updated:
  ├─ workflow_executions: Status = "completed"
  ├─ email_logs: Record of all emails sent
  ├─ sms_logs: Record of all SMS sent
  ├─ appointment_reminders: Status = "sent"
  └─ scheduled_tasks: last_executed timestamp
```

---

## 🛠️ Monitoring & Management

### Check Workflow History

```sql
SELECT * FROM workflow_executions 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Check Email Logs

```sql
SELECT * FROM email_logs 
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Check Scheduled Reminders

```sql
SELECT * FROM appointment_reminders 
WHERE status = 'pending'
AND scheduled_time < NOW() + INTERVAL '1 hour'
ORDER BY scheduled_time;
```

### Get System Statistics via API

```bash
curl http://localhost:8000/api/statistics
```

Response:
```json
{
  "total_customers": 45,
  "total_appointments": 123,
  "total_workflows_executed": 456,
  "successful_workflows": 450,
  "failed_workflows": 6
}
```

---

## ⚙️ Advanced Configuration

### Custom Email Templates

```python
# workflow_engine.py
class EmailService:
    def send_custom_email(self, recipient: str, template_name: str, data: dict) -> bool:
        templates = {
            'appointment_confirmation': self.appointment_confirmation_template,
            'appointment_reminder': self.appointment_reminder_template,
            'follow_up': self.follow_up_template,
        }
        
        template = templates.get(template_name)
        html = template.format(**data)
        return self.send_email(recipient, subject, html, html=True)
```

### Multiple Reminders

```python
# Schedule multiple reminders at different times
reminders = [
    (1440, "appointment_reminder_24h"),    # 24 hours
    (120, "appointment_reminder_2h"),      # 2 hours
    (15, "appointment_reminder_15m"),      # 15 minutes
]

for minutes, reminder_type in reminders:
    await reminder_scheduler.schedule_reminder(
        appointment_id, customer_id, minutes
    )
```

### Retry Logic

```python
# Automatic retries on failure
task = ScheduledTask(
    id="task_001",
    callback=send_email,
    max_retries=3,  # Retry up to 3 times
    schedule_type=ScheduleType.INTERVAL,
    interval_seconds=300  # Retry every 5 minutes
)
```

---

## 🐛 Troubleshooting

### Issue: Emails Not Sending

**Solution**: Check email configuration
```python
# Test email connection
result = email_service.send_email(
    "test@example.com",
    "Test Subject",
    "Test Body"
)
print(result)  # Should be True
```

### Issue: Reminders Not Running

**Solution**: Ensure scheduler is running
```bash
# Check if server is running
curl http://localhost:8000/api/tasks/status

# Start scheduler if stopped
curl -X POST http://localhost:8000/api/scheduler/start
```

### Issue: Database Connection Error

**Solution**: Verify Supabase credentials in `.env`
```bash
# Test Supabase connection
python -c "from supabase import create_client; c = create_client(url, key); print(c)"
```

---

## 📋 Quick Reference: Workflow Execution Timeline

| Time | Action | Result |
|------|--------|--------|
| 0:00 | Appointment created | Record saved in DB |
| 0:01 | Webhook triggers | Edge Function called |
| 0:02 | Python API receives | Workflow starts |
| 0:03 | Confirmation email sent | Email log created |
| 0:04 | Loyalty points updated | Customer table updated |
| 0:05 | Staff notified | Staff email sent |
| 0:06 | Reminders scheduled | Tasks created in scheduler |
| T-24h | Scheduler checks | 24h reminder sent |
| T-2h | Scheduler checks | 2h SMS reminder sent |
| T+3d | Scheduler checks | Follow-up email sent |

---

## 🎓 Key Concepts

### **Workflow vs Task**
- **Workflow**: Container for multiple tasks (e.g., "AppointmentScheduled" workflow)
- **Task**: Individual unit of work (e.g., "SendEmail", "UpdateDatabase")

### **Scheduling vs Immediate Execution**
- **Immediate**: Tasks run as soon as workflow triggers
- **Scheduled**: Tasks run at specific future times via scheduler

### **Async Processing**
- All I/O operations (email, SMS, database) are async
- Allows handling multiple requests simultaneously
- Non-blocking execution

---

## 📞 Support Integration

The system also handles **customer support tickets**:

```python
# When customer submits support ticket
await workflow_engine.handle_support_ticket_workflow(
    customer=customer,
    ticket=ticket,
    email_service=email_service
)

# Tasks:
# 1. Try to auto-resolve common questions
# 2. Send response email
# 3. Create escalation if needed
# 4. Notify support team
```

---

This completes the integration of the automation system with your Supabase backend. The system is now fully automated and will handle all customer communications, appointment reminders, and follow-ups!
