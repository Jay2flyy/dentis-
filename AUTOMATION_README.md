# Dental Practice Automation System

A comprehensive Python-based automation workflow engine for managing customer support, appointments, reminders, follow-ups, and more for dental practices.

## Features

### 🎯 Workflow Automation
- **Appointment Scheduling Workflow**: Automatically send confirmations, update loyalty points, and notify staff
- **Appointment Reminder Workflow**: Send email and SMS reminders before appointments
- **Support Ticket Handling**: Auto-resolve common support inquiries and escalate complex ones
- **Loyalty Points Management**: Automatically track and update patient loyalty points
- **Staff Notifications**: Alert staff about upcoming appointments and special cases

### ⏰ Background Task Scheduling
- **One-time Tasks**: Execute tasks at specific times
- **Recurring Tasks**: Daily, weekly, monthly schedules
- **Interval Tasks**: Execute at fixed intervals
- **Automatic Retries**: Configurable retry logic for failed tasks
- **Task Monitoring**: Track task execution status and history

### 📧 Communication Services
- **Email Service**: Send HTML and plain text emails via SMTP
- **SMS Service**: Send SMS notifications via Twilio API
- **Template Support**: Pre-built email templates for various scenarios
- **Multi-channel Notifications**: Reach customers via email and SMS

### 📅 Reminder & Follow-up Management
- **Appointment Reminders**: Configurable reminder times (24h, 2h, etc.)
- **Post-Appointment Follow-ups**: Automatic follow-up emails after appointments
- **Appointment Confirmation**: Welcome new bookings
- **No-show Handling**: Track and follow up on missed appointments

### 👥 Customer Management
- **Customer Profiles**: Store comprehensive customer information
- **Loyalty Points Tracking**: Automatic loyalty point accumulation
- **Communication Preferences**: Track customer preferences
- **Visit History**: Maintain appointment and visit records

## Architecture

```
┌─────────────────────────────────────────────┐
│     Dental Practice Automation System        │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │      Workflow Engine                 │  │
│  │  - Workflow orchestration            │  │
│  │  - Task execution                    │  │
│  │  - Error handling & retry            │  │
│  └──────────────────────────────────────┘  │
│           │                                 │
│           ├─ EmailService                   │
│           ├─ SMSService                     │
│           └─ WorkflowTasks                  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │      Task Scheduler                  │  │
│  │  - Background task management        │  │
│  │  - Schedule execution                │  │
│  │  - Task lifecycle management         │  │
│  └──────────────────────────────────────┘  │
│           │                                 │
│           ├─ ReminderScheduler              │
│           ├─ FollowUpScheduler              │
│           └─ MaintenanceScheduler           │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │      Data Models                     │  │
│  │  - Customer                          │  │
│  │  - Appointment                       │  │
│  │  - SupportTicket                     │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Installation

1. **Clone or copy the automation module**:
```bash
# Copy the automation folder to your project
cp -r automation/ /path/to/dental-practice-automation/
```

2. **No external dependencies required for core functionality**, but recommended for production:
```bash
pip install aiosmtplib  # For async email sending
pip install requests    # For API calls (included in example)
```

## Quick Start

### Basic Example

```python
import asyncio
from datetime import datetime, timedelta
from automation import (
    WorkflowEngine, Customer, Appointment, AppointmentStatus,
    EmailService, TaskScheduler, ReminderScheduler
)

async def main():
    # Initialize services
    email_service = EmailService(
        smtp_server="smtp.gmail.com",
        smtp_port=587,
        sender_email="your_email@gmail.com",
        sender_password="your_app_password"
    )
    
    # Create workflow engine
    engine = WorkflowEngine()
    engine.email_service = email_service
    
    # Create a customer
    customer = Customer(
        id="cust_001",
        name="John Doe",
        email="john@example.com",
        phone="+1234567890",
        created_at=datetime.now()
    )
    engine.add_customer(customer)
    
    # Create an appointment
    appointment = Appointment(
        id="apt_001",
        customer_id="cust_001",
        service_type="Teeth Cleaning",
        scheduled_time=datetime.now() + timedelta(days=7),
        duration_minutes=60,
        status=AppointmentStatus.SCHEDULED
    )
    engine.add_appointment(appointment)
    
    # Execute workflow
    result = await engine.schedule_appointment_workflow(
        customer, appointment, email_service
    )
    print(f"Workflow result: {result['status']}")

asyncio.run(main())
```

## Workflows

### 1. Appointment Scheduling Workflow

**Triggered**: When a new appointment is created

**Tasks**:
- Send appointment confirmation email
- Update customer loyalty points
- Notify staff

**Usage**:
```python
result = await workflow_engine.schedule_appointment_workflow(
    customer=customer,
    appointment=appointment,
    email_service=email_service
)
```

### 2. Appointment Reminder Workflow

**Triggered**: Scheduled reminders before appointments

**Tasks**:
- Send email reminder
- Send SMS reminder (optional)

**Usage**:
```python
result = await workflow_engine.schedule_reminder_workflow(
    customer=customer,
    appointment=appointment,
    email_service=email_service,
    sms_service=sms_service,
    hours_before=24  # Remind 24 hours before
)
```

### 3. Support Ticket Handling Workflow

**Triggered**: When customer submits support inquiry

**Tasks**:
- Attempt auto-resolution with AI
- Send response email
- Create ticket if escalation needed

**Usage**:
```python
result = await workflow_engine.handle_support_ticket_workflow(
    customer=customer,
    ticket=ticket,
    email_service=email_service
)
```

## Scheduling

### ReminderScheduler

Schedule appointment reminders at configurable times:

```python
scheduler = TaskScheduler()
reminder_scheduler = ReminderScheduler(scheduler, workflow_engine)

await scheduler.start()

# Schedule 24-hour reminder
reminder_id = await reminder_scheduler.schedule_reminder(
    appointment_id="apt_001",
    customer_id="cust_001",
    reminder_minutes_before=1440  # 24 hours
)

# Cancel if needed
reminder_scheduler.cancel_reminder(reminder_id)

await scheduler.stop()
```

### FollowUpScheduler

Schedule post-appointment follow-ups:

```python
follow_up_scheduler = FollowUpScheduler(scheduler, workflow_engine)

# Schedule follow-up 3 days after appointment
follow_up_id = await follow_up_scheduler.schedule_follow_up(
    appointment_id="apt_001",
    customer_id="cust_001",
    days_after=3
)
```

### MaintenanceScheduler

Schedule system maintenance tasks:

```python
maintenance_scheduler = MaintenanceScheduler(scheduler)

# Schedule daily backups
async def backup_database():
    # Your backup logic here
    pass

await maintenance_scheduler.schedule_database_backup(
    backup_function=backup_database,
    interval_hours=24
)
```

## Data Models

### Customer

```python
@dataclass
class Customer:
    id: str
    name: str
    email: str
    phone: str
    created_at: datetime
    last_visit: Optional[datetime] = None
    loyalty_points: int = 0
    preferences: Dict[str, Any] = None
```

### Appointment

```python
@dataclass
class Appointment:
    id: str
    customer_id: str
    service_type: str
    scheduled_time: datetime
    duration_minutes: int
    status: AppointmentStatus
    dentist: Optional[str] = None
    notes: Optional[str] = None
    reminders_sent: List[str] = None
```

### SupportTicket

```python
@dataclass
class SupportTicket:
    id: str
    customer_id: str
    subject: str
    description: str
    status: SupportTicketStatus
    created_at: datetime
    updated_at: datetime
    assigned_to: Optional[str] = None
    priority: str = "normal"
    messages: List[Dict[str, str]] = None
```

## Services

### EmailService

```python
email_service = EmailService(
    smtp_server="smtp.gmail.com",
    smtp_port=587,
    sender_email="practice@example.com",
    sender_password="app_password"
)

# Send generic email
email_service.send_email(
    recipient_email="patient@example.com",
    subject="Your Appointment",
    body="Your appointment is scheduled...",
    html=True
)

# Send appointment confirmation
email_service.send_appointment_confirmation(customer, appointment)

# Send reminder
email_service.send_appointment_reminder(customer, appointment, hours_before=24)
```

### SMSService

```python
sms_service = SMSService(api_key="your_twilio_key")

# Send SMS
sms_service.send_sms(
    phone_number="+1234567890",
    message="Your appointment is tomorrow at 10:00 AM"
)

# Send appointment reminder via SMS
sms_service.send_appointment_reminder_sms(customer.phone, appointment)
```

## Statistics & Monitoring

### Get System Statistics

```python
stats = workflow_engine.get_statistics()
print(f"Total Customers: {stats['total_customers']}")
print(f"Total Appointments: {stats['total_appointments']}")
print(f"Workflows Executed: {stats['total_workflows_executed']}")
print(f"Successful: {stats['successful_workflows']}")
print(f"Failed: {stats['failed_workflows']}")
```

### Workflow History

```python
history = workflow_engine.get_workflow_history()
for workflow in history:
    print(f"{workflow['workflow_name']}: {workflow['status']}")
    print(f"Duration: {workflow['duration_seconds']}s")
```

### Task Status

```python
# Get specific task status
task_status = scheduler.get_task_status("task_id")

# Get all tasks
all_tasks = scheduler.get_all_tasks_status()
```

## Configuration

### Email Configuration (Gmail)

1. Enable 2-factor authentication
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use app password in code (not regular password)

```python
email_service = EmailService(
    smtp_server="smtp.gmail.com",
    smtp_port=587,
    sender_email="your_email@gmail.com",
    sender_password="xxxx xxxx xxxx xxxx"  # 16-character app password
)
```

### SMS Configuration (Twilio)

1. Sign up at https://www.twilio.com/
2. Get API key from Twilio dashboard
3. Add Twilio phone number

```python
sms_service = SMSService(
    api_key="your_twilio_api_key",
    api_url="https://api.twilio.com"
)
```

## Advanced Features

### Custom Workflow Tasks

Create custom tasks by extending `WorkflowTask`:

```python
from automation import WorkflowTask

class CustomTask(WorkflowTask):
    async def execute(self, context):
        # Your custom logic here
        return {
            'success': True,
            'task': self.get_name(),
            'timestamp': datetime.now().isoformat()
        }
    
    def get_name(self):
        return "CustomTask"
```

### Schedule Types

- `ONCE`: Execute single time
- `DAILY`: Execute every day at same time
- `WEEKLY`: Execute every week
- `MONTHLY`: Execute every month
- `INTERVAL`: Execute at fixed intervals

```python
task = ScheduledTask(
    id="task_001",
    name="My Task",
    callback=my_callback,
    schedule_type=ScheduleType.DAILY,
    execute_at=datetime.now()
)
```

## Error Handling

The system includes built-in error handling:

- **Task Retries**: Automatically retries failed tasks (configurable)
- **Workflow Failure Handling**: Continues with next tasks even if one fails
- **Logging**: Comprehensive logging of all operations
- **Status Tracking**: Track workflow and task execution status

```python
result = await workflow.execute(context)
if result['status'] == 'failed':
    print(f"Workflow failed: {result['status']}")
    for task_result in result['results']:
        if not task_result['success']:
            print(f"Failed task: {task_result['task']}")
```

## Performance Considerations

- **Async Operations**: All I/O operations are async for better performance
- **Batch Processing**: Group similar tasks for efficiency
- **Database Indexing**: Index frequently queried fields
- **Rate Limiting**: Implement rate limiting for API calls
- **Caching**: Cache common responses

## Integration with Web App

### With FastAPI

```python
from fastapi import FastAPI
from automation import WorkflowEngine

app = FastAPI()
workflow_engine = WorkflowEngine()

@app.post("/api/appointments")
async def create_appointment(appointment_data: dict):
    # Create appointment in database
    # ... 
    
    # Execute workflow
    result = await workflow_engine.schedule_appointment_workflow(
        customer, appointment, email_service
    )
    return result
```

### With Django

```python
from django.http import JsonResponse
from automation import WorkflowEngine
import asyncio

workflow_engine = WorkflowEngine()

def create_appointment(request):
    # Create appointment in database
    # ...
    
    # Execute workflow (in background task)
    loop = asyncio.new_event_loop()
    result = loop.run_until_complete(
        workflow_engine.schedule_appointment_workflow(...)
    )
    return JsonResponse(result)
```

## Logging

All operations are logged with detailed information:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
logger.info("Appointment scheduled")
logger.error("Failed to send email")
```

## Best Practices

1. **Use Environment Variables**: Store API keys in environment variables
2. **Test Email Configuration**: Send test email before deployment
3. **Monitor Task Execution**: Regularly check task status and logs
4. **Implement Graceful Shutdown**: Always call `await scheduler.stop()`
5. **Handle Exceptions**: Wrap async operations in try-except blocks
6. **Document Custom Tasks**: Add docstrings to custom task implementations
7. **Review Logs Regularly**: Monitor logs for errors and issues
8. **Set Appropriate Timeouts**: Configure email/SMS timeouts

## Troubleshooting

### Email Not Sending
- Check SMTP credentials
- Verify firewall isn't blocking SMTP port (587)
- Check Gmail app password (not regular password)
- Enable "Less secure app access" if needed

### SMS Not Sending
- Verify Twilio API key
- Check phone number format
- Ensure account has credits
- Verify Twilio phone number is in production

### Scheduler Not Running
- Ensure `await scheduler.start()` is called
- Check for exceptions in logs
- Verify asyncio event loop is running
- Check task conditions and timing

## Contributing

To contribute improvements:

1. Create custom tasks or extensions
2. Add new scheduler types
3. Improve email templates
4. Add more communication channels
5. Enhance error handling

## License

This automation system is part of the Dental Practice Automation project.

## Support

For issues or questions:
1. Check the logs for error messages
2. Review example usage in `example_usage.py`
3. Consult the troubleshooting section
4. Check API documentation for services

## Changelog

### Version 1.0.0
- Initial release
- Workflow engine implementation
- Task scheduler with multiple schedule types
- Email and SMS services
- Reminder and follow-up management
- Support ticket handling
- Comprehensive logging and monitoring
