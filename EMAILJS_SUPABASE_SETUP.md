# EmailJS + Supabase Automation Complete Setup Guide

This guide shows you how to integrate EmailJS with Supabase Edge Functions for automated appointment confirmations and reminders.

## 📋 Quick Reference

| Service | ID |
|---------|-----|
| EmailJS Service ID | `service_yawbxfr` |
| EmailJS Template ID | `dentist_email` |
| Template Type | Universal (dynamically adapts to all email types) |

---

## 🎯 How It Works

```
1. Patient Books Appointment
         ↓
2. Appointment inserted into Supabase DB
         ↓
3. Webhook triggers Edge Function
         ↓
4. Edge Function:
   - Sends confirmation via EmailJS
   - Logs email in email_logs table
   - Creates 24h and 2h reminders
   ↓
5. Scheduler checks for due reminders every minute
   ↓
6. When reminder time arrives:
   - Sends reminder email via EmailJS
   - Logs in email_logs table
   - Updates reminder status to "sent"
```

---

## 🛠️ Step 1: Set Up Supabase Tables & Functions

Run this SQL in your Supabase SQL Editor:

**File**: `supabase/setup-automation.sql`

```sql
-- Copy entire contents of setup-automation.sql
-- This creates:
-- - email_logs table (tracks all emails)
-- - appointment_reminders table (manages reminders)
-- - workflow_executions table (tracks workflows)
-- - Automatic trigger to schedule reminders
-- - Views for statistics
```

### How to run:

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `setup-automation.sql`
4. Click **Run**

✅ You should see: "7 rows affected"

---

## 📧 Step 2: Create Universal EmailJS Template

### In EmailJS Dashboard:

1. Go to **Email Templates**
2. Click **Create New Template**
3. **Template Name**: `dentist_email`
4. **Template ID**: Keep auto-generated or use `dentist_email`

### Template HTML

Use this universal template that adapts to all email types:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }
        .container {
            background: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: white;
            padding: 20px;
            border-radius: 0 0 8px 8px;
        }
        .appointment-details {
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #667eea;
        }
        .value {
            color: #333;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin: 10px 0;
        }
        .alert {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 15px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Makhanda Smiles Dental Practice</h1>
        <p>Professional Dental Care</p>
    </div>

    <div class="content">
        <h2>Hello {{to_name}},</h2>

        {{#if_eq template_type "appointment_confirmation"}}
        <p>Your appointment has been successfully confirmed!</p>
        
        <div class="appointment-details">
            <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">{{service_type}}</span>
            </div>
            <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">{{appointment_date}}</span>
            </div>
            <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">{{appointment_time}}</span>
            </div>
            <div class="detail-row">
                <span class="label">Duration:</span>
                <span class="value">{{appointment_duration}}</span>
            </div>
            {{#if dentist_name}}
            <div class="detail-row">
                <span class="label">Dentist:</span>
                <span class="value">{{dentist_name}}</span>
            </div>
            {{/if}}
        </div>

        <div class="alert">
            <strong>📍 Remember:</strong> Please arrive 10 minutes early. If you need to reschedule, contact us at least 24 hours in advance.
        </div>
        {{/if_eq}}

        {{#if_eq template_type "appointment_reminder_24h"}}
        <p>This is a friendly reminder about your upcoming appointment:</p>
        
        <div class="appointment-details">
            <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">{{service_type}}</span>
            </div>
            <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">{{appointment_date}}</span>
            </div>
            <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">{{appointment_time}}</span>
            </div>
        </div>

        <p><strong>Your appointment is tomorrow!</strong> We're looking forward to seeing you.</p>
        {{/if_eq}}

        {{#if_eq template_type "appointment_reminder_2h"}}
        <p><strong>⏰ Your appointment is in 2 hours!</strong></p>
        
        <div class="appointment-details">
            <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">{{appointment_time}}</span>
            </div>
            <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">{{service_type}}</span>
            </div>
        </div>

        <p>Don't forget! Please arrive on time. We're ready for you!</p>
        {{/if_eq}}

        {{#if_eq template_type "appointment_followup"}}
        <p>Thank you for visiting Makhanda Smiles Dental Practice!</p>
        
        <p>We hope you had an excellent experience with your {{service_type}}.</p>

        {{#if loyalty_points}}
        <div class="alert" style="background: #d4edda; border-left-color: #28a745;">
            <strong>🎁 Loyalty Bonus:</strong> You've earned {{loyalty_points}} loyalty points!
        </div>
        {{/if}}

        <p>If you have any questions or concerns about your treatment, please don't hesitate to contact us.</p>
        {{/if_eq}}

        {{#if_eq template_type "support_ticket_response"}}
        <p>Thank you for contacting us. Here's our response:</p>
        
        <div class="appointment-details">
            <div class="detail-row">
                <span class="label">Ticket ID:</span>
                <span class="value">#{{ticket_id}}</span>
            </div>
        </div>

        <p>{{message_body}}</p>

        <p>If you have any further questions, please reply to this email.</p>
        {{/if_eq}}

        {{#if_eq template_type "contact_form_confirmation"}}
        <p>Thank you for contacting Makhanda Smiles!</p>
        
        <p>We have received your message and will get back to you as soon as possible.</p>

        <p><strong>Your message:</strong></p>
        <p>{{message_body}}</p>

        <p>We appreciate your interest and look forward to helping you!</p>
        {{/if_eq}}

        {{#if_eq template_type "lead_response"}}
        <p>Welcome to Makhanda Smiles Dental Practice!</p>
        
        <p>{{message_body}}</p>

        <p>We look forward to meeting you soon!</p>
        {{/if_eq}}

        <!-- Fallback content -->
        {{#unless template_type}}
        {{custom_content}}
        {{/unless}}

        <p>Best regards,<br><strong>{{dentist_name}}</strong></p>
    </div>

    <div class="footer">
        <p>{{practice_address}} | {{practice_phone}}</p>
        <p>© 2025 Makhanda Smiles Dental Practice. All rights reserved.</p>
    </div>
</body>
</html>
```

### Template Variables (Template Parameters):

```
to_name              # Patient name
to_email             # Recipient email
subject              # Email subject
template_type        # Type: appointment_confirmation, appointment_reminder_24h, etc.
appointment_date     # Date of appointment
appointment_time     # Time of appointment
appointment_duration # Duration (e.g., "60 minutes")
service_type         # Service name (e.g., "Teeth Cleaning")
dentist_name         # Dentist name
practice_phone       # Practice phone number
practice_address     # Practice address
loyalty_points       # Loyalty points earned (if applicable)
message_body         # Custom message body
ticket_id            # Support ticket ID (if applicable)
follow_up_message    # Follow-up message
custom_content       # Custom content/fallback
```

---

## 🚀 Step 3: Deploy Edge Functions

### Function 1: Handle Appointment Created

**File**: `supabase/functions/handle-appointment-created/index.ts`

Deploy with:
```bash
supabase functions deploy handle-appointment-created
```

This function:
- Triggers when appointment is inserted
- Sends confirmation email via EmailJS
- Creates 24h and 2h reminders
- Logs workflow execution

### Function 2: Send Reminders

**File**: `supabase/functions/send-reminders/index.ts`

Deploy with:
```bash
supabase functions deploy send-reminders
```

This function:
- Gets all pending reminders that are due
- Sends reminder emails via EmailJS
- Updates reminder status
- Logs email activity

---

## 🔗 Step 4: Set Up Supabase Webhooks

### Webhook 1: Appointment Created

1. Go to Supabase Dashboard → **Database** → **Webhooks**
2. Click **Create Webhook**
3. Configure:
   - **Name**: `appointment-created`
   - **Table**: `appointments`
   - **Events**: `INSERT`
   - **HTTP Request**:
     - **Method**: `POST`
     - **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/handle-appointment-created`
     - **Headers**:
       ```
       Authorization: Bearer YOUR_ANON_KEY
       ```

---

## ⏰ Step 5: Set Up Background Task (Reminder Sender)

The reminders are sent by a background process. You have two options:

### Option A: Supabase Functions Invocation

In your frontend or backend, call the reminder function periodically:

```javascript
// Call every minute from your app
setInterval(async () => {
  const response = await fetch(
    'https://YOUR_PROJECT.supabase.co/functions/v1/send-reminders',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer YOUR_ANON_KEY`,
        'Content-Type': 'application/json'
      }
    }
  );
  console.log('Reminders processed:', await response.json());
}, 60000); // Every minute
```

### Option B: External CRON (Recommended for Production)

Use a service like:
- **EasyCron**: https://www.easycron.com/
- **n8n**: https://n8n.io/
- **Make**: https://www.make.com/

Configure to call:
```
POST https://YOUR_PROJECT.supabase.co/functions/v1/send-reminders
Every 1 minute
```

---

## 📨 Step 6: Frontend Integration

### Install EmailJS (if using React)

```bash
npm install @emailjs/browser
```

### Use the Email Service

```typescript
import { emailService } from '@/services/emailService';

// Send confirmation
await emailService.sendAppointmentConfirmation(
  'John Doe',
  'john@example.com',
  '2025-01-15',
  '10:00',
  'Teeth Cleaning',
  'Dr. Smith'
);

// Send 24h reminder
await emailService.sendReminder24h(
  'John Doe',
  'john@example.com',
  '2025-01-15',
  '10:00',
  'Teeth Cleaning'
);

// Send follow-up
await emailService.sendFollowUp(
  'John Doe',
  'john@example.com',
  'Teeth Cleaning',
  15 // loyalty points
);
```

---

## 🔐 Step 7: Set Environment Variables

In your Supabase Edge Functions secrets:

```
EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

---

## 📊 Monitor Your Automations

### View Sent Emails

```sql
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 20;
```

### View Pending Reminders

```sql
SELECT * FROM appointment_reminders WHERE status = 'pending' AND scheduled_time <= NOW();
```

### View Workflow History

```sql
SELECT workflow_name, status, COUNT(*) FROM workflow_executions GROUP BY workflow_name, status;
```

### Email Statistics

```sql
SELECT * FROM email_statistics ORDER BY date DESC;
```

---

## 🧪 Testing

### Test 1: Create Test Appointment

```sql
INSERT INTO appointments (
    patient_name,
    patient_email,
    patient_phone,
    appointment_date,
    appointment_time,
    service_type,
    status
) VALUES (
    'Test Patient',
    'your_email@gmail.com',
    '+27791234567',
    CURRENT_DATE + INTERVAL '3 days',
    '14:00',
    'Teeth Cleaning',
    'pending'
);
```

**Expected**: 
- Confirmation email sent
- Reminders created in `appointment_reminders` table
- Workflow logged in `workflow_executions` table

### Test 2: Manually Trigger Reminder

```sql
UPDATE appointment_reminders 
SET scheduled_time = NOW() 
WHERE reminder_type = '24h' 
LIMIT 1;
```

Then call: `POST https://YOUR_PROJECT.supabase.co/functions/v1/send-reminders`

**Expected**: Reminder email sent, status updated to "sent"

---

## 🐛 Troubleshooting

### Issue: Emails Not Sending

**Check**:
1. EmailJS credentials correct in Edge Function
2. Email logs table has entries with status "failed"
3. Check error message in `email_logs.error_message`

```sql
SELECT * FROM email_logs WHERE status = 'failed';
```

### Issue: Reminders Not Scheduled

**Check**:
1. Appointment was created correctly
2. `appointment_reminders` table has entries
3. Trigger `trigger_schedule_reminders` is active

```sql
SELECT * FROM appointment_reminders WHERE appointment_id = 'YOUR_ID';
```

### Issue: Edge Function Not Called

**Check**:
1. Webhook is enabled
2. Webhook URL is correct
3. Authorization header is set
4. Check Supabase logs: `supabase functions logs handle-appointment-created`

---

## 📈 Advanced: Customizing Templates

### Different Email for Each Service Type

```typescript
async function sendServiceSpecificEmail(serviceType: string, customer: Customer) {
  const templates: Record<string, string> = {
    'Teeth Cleaning': 'cleaning_care_tips_template',
    'Teeth Whitening': 'whitening_maintenance_template',
    'Dental Implant': 'implant_follow_up_template',
  };
  
  const customTemplate = templates[serviceType];
  // Use custom template logic
}
```

### Dynamic Pricing in Emails

```typescript
const servicePrice: Record<string, number> = {
  'General Checkup': 1600,
  'Teeth Cleaning': 2400,
  'Teeth Whitening': 8000,
};

await emailService.sendEmail({
  // ... other fields
  service_price: servicePrice[appointment.service_type],
});
```

---

## 🎯 Complete Workflow Timeline

```
Day 0, 10:00 AM
└─ Patient books "Teeth Cleaning" for Jan 15, 10:00 AM

Day 0, 10:01 AM
├─ Appointment saved to DB
├─ Webhook triggers
├─ Confirmation email sent
├─ Reminders created:
│  ├─ 24h reminder: Jan 14 10:00 AM
│  └─ 2h reminder: Jan 15 8:00 AM
└─ Workflow logged

Day 1 (Jan 14), 10:00 AM
└─ Scheduler runs:
   └─ Sends "Appointment tomorrow" email
   └─ Updates reminder status to "sent"

Day 2 (Jan 15), 8:00 AM
└─ Scheduler runs:
   └─ Sends "2 hours left" email
   └─ Updates reminder status to "sent"

Day 2 (Jan 15), 10:00 AM
└─ Appointment happens

Day 5 (Jan 18), 10:00 AM
└─ Follow-up email sent (manual trigger or scheduled)
   └─ "How was your visit?" + loyalty points
```

---

## 📝 Configuration Summary

| Item | Value |
|------|-------|
| Service ID | `service_yawbxfr` |
| Template ID | `dentist_email` |
| Template Type | Universal HTML |
| Edge Functions | 2 (appointment-created, send-reminders) |
| Database Tables | 3 (email_logs, appointment_reminders, workflow_executions) |
| Triggers | 1 (schedule_appointment_reminders) |
| Views | 3 (statistics & pending reminders) |
| Reminder Types | 3 (24h, 2h, followup) |

---

## ✅ Setup Checklist

- [ ] Run `setup-automation.sql` in Supabase SQL Editor
- [ ] Create EmailJS template with HTML and variables
- [ ] Deploy `handle-appointment-created` Edge Function
- [ ] Deploy `send-reminders` Edge Function
- [ ] Set up Supabase webhook for appointments
- [ ] Configure reminder scheduler (CRON or frontend)
- [ ] Set environment variables in Edge Functions
- [ ] Test with sample appointment
- [ ] Verify emails in `email_logs` table
- [ ] Check reminders in `appointment_reminders` table
- [ ] Monitor with provided SQL queries

---

**You're all set!** Your appointment automation system is now live with:
✅ Automatic confirmations via EmailJS
✅ Scheduled reminders (24h, 2h)
✅ Email and workflow logging
✅ Easy monitoring and statistics
