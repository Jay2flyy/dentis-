# User Objective
Implement automated appointment reminders, daily chatbot conversation summary, real-time dentist notifications, and an interactive calendar UI in the chat.

## User Review Required
> [!IMPORTANT]
> **Timezone Assumptions**: The user specified reminders at "6am uct +2" and summary at "6pm uct +2".
> I will assume UTC+2 is the practice's local time. I will schedule the cron jobs effectively at 04:00 UTC and 16:00 UTC respectively.

> [!IMPORTANT]
> **Email Provider Change**: The user explicitly requested using **Gmail SMTP** instead of EmailJS.
> I will use `nodemailer` (Deno compatible version) in the Edge Functions to send emails via `smtp.gmail.com`.
> **Prerequisites**: The user MUST set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in their Supabase secrets.

## Proposed Changes

### Database Schema
#### [MODIFY] [setup-automation.sql](file:///c:/Users/justin/Documents/webistes/dental-practice-automation%20original%20backup/dental-practice-automation%20backup/dental-practice-automation/supabase/setup-automation.sql)
- Update `schedule_appointment_reminders` function to include a `day_of` reminder at 06:00 UTC+2 on the appointment day.
- Create `chat_messages` table to persist conversation history.

### Backend Functions (Supabase Edge Functions)
#### [MODIFY] [send-reminders/index.ts](file:///c:/Users/justin/Documents/webistes/dental-practice-automation%20original%20backup/dental-practice-automation%20backup/dental-practice-automation/supabase/functions/send-reminders/index.ts)
- **Refactor**: Replace EmailJS logic with **Gmail SMTP** logic using `nodemailer`.
- Update logic to handle `day_of` reminder type.

#### [NEW] [send-daily-summary/index.ts](file:///c:/Users/justin/Documents/webistes/dental-practice-automation%20original%20backup/dental-practice-automation%20backup/dental-practice-automation/supabase/functions/send-daily-summary/index.ts)
- Create a new function to:
    1. Query `chat_messages` from the last 24 hours.
    2. Format the conversations into a readable summary (Text/HTML).
    3. Send this summary to `mudimbujustin2@gmail.com` via **Gmail SMTP**.
    4. Scheduled to run at 16:00 UTC (6PM UTC+2).

#### [NEW] [handle-appointment-rescheduled/index.ts](file:///c:/Users/justin/Documents/webistes/dental-practice-automation%20original%20backup/dental-practice-automation%20backup/dental-practice-automation/supabase/functions/handle-appointment-rescheduled/index.ts)
- Create a new function (or trigger-based handler) specifically for **Reschedule Events**.
- Sends a "Your Appointment has been Rescheduled" email (distinct from "Booking Confirmed").
- Logic:
    1. Triggered via database webhook on `UPDATE appointments` (when date/time changes).
    2. Uses **Gmail SMTP**.
    3. Sends to patient with new time details and "Reschedule Success" subject.

#### [MODIFY] [handle-appointment-created/index.ts](file:///c:/Users/justin/Documents/webistes/dental-practice-automation%20original%20backup/dental-practice-automation%20backup/dental-practice-automation/supabase/functions/handle-appointment-created/index.ts)
- **Refactor**: Replace EmailJS with Gmail SMTP.
- **Update**: Add logic to send a notification email to the dentist (`mudimbujustin2@gmail.com`) whenever a new appointment is booked.

#### [UPDATE] [handle-appointment-rescheduled/index.ts](file:///c:/Users/justin/Documents/webistes/dental-practice-automation%20original%20backup/dental-practice-automation%20backup/dental-practice-automation/supabase/functions/handle-appointment-rescheduled/index.ts)
- **Update**: Add logic to send a notification email to the dentist (`mudimbujustin2@gmail.com`) whenever an appointment is rescheduled.
### Frontend Integration
#### [NEW] [src/components/ChatCalendar.tsx](file:///c:/Users/justin/Documents/webistes/dental-practice-automation%20original%20backup/dental-practice-automation%20backup/dental-practice-automation/src/components/ChatCalendar.tsx)
- Create a new interactive calendar component.
- Features:
    - Month view with clickable dates.
    - On date click: Show available time slots for that day (fetching from `getAvailableSlots`).
    - On slot click: Confirm selection and trigger booking/rescheduling flow.

#### [MODIFY] [ThandiVoiceAssistant.tsx](file:///c:/Users/justin/Documents/webistes/dental-practice-automation%20original%20backup/dental-practice-automation%20backup/dental-practice-automation/src/components/ThandiVoiceAssistant.tsx)
- Update `handleUserInput` to save both User and Assistant messages to the new `chat_messages` table in real-time.
- **New Feature**: Support rendering custom UI components (like `ChatCalendar`) within the message history based on AI tool output (e.g. `[SHOW_CALENDAR]`).

## Verification Plan
### Automated Tests
- I cannot run automated tests on the Edge Functions locally without Deno/Docker setup, but I will validat request syntax.

### Manual Verification
1. **Chat Logging**: Chat with the bot and verify rows appear in `chat_messages` table via `supabase db execute`.
2. **Reminders**: Manually insert a test appointment for "Today" and trigger the `schedule_appointment_reminders` trigger to see if `day_of` reminder is created.
4. **Calendar UI**: Verify the "Show Calendar" command triggers the UI, and clicking a slot successfully books an appointment.
5. **Dentist Emails**: Verify `mudimbujustin2@gmail.com` receives emails for every new booking and reschedule.
