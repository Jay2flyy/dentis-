-- ============================================================================
-- AUTOMATION V2: CHAT HISTORY & ENHANCED REMINDERS
-- ============================================================================

-- 1. Create Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (for the chat bot to work publicly)
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON chat_messages;
CREATE POLICY "Anyone can insert chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (true);

-- Allow users to read their own messages (optional, mostly for admin aggregation)
DROP POLICY IF EXISTS "Admins can view all chat messages" ON chat_messages;
CREATE POLICY "Admins can view all chat messages"
    ON chat_messages FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- 2. Update Reminder Trigger Function for "Day Of" Reminder
CREATE OR REPLACE FUNCTION schedule_appointment_reminders()
RETURNS TRIGGER AS $$
DECLARE
    reminder_24h TIMESTAMP WITH TIME ZONE;
    reminder_day_of TIMESTAMP WITH TIME ZONE;
    appointment_datetime TIMESTAMP WITH TIME ZONE;
BEGIN
    appointment_datetime := (NEW.appointment_date || ' ' || NEW.appointment_time)::TIMESTAMP;
    
    -- Calculate reminder times
    -- 1. 24 Hours Before
    reminder_24h := appointment_datetime - INTERVAL '24 hours';
    
    -- 2. Morning of the appointment (06:00 AM on the day)
    -- This assumes the server time is aligned or we simply take the date and add 06:00:00
    reminder_day_of := (NEW.appointment_date || ' 06:00:00')::TIMESTAMP;
    
    -- Insert 24-hour reminder
    INSERT INTO appointment_reminders (appointment_id, reminder_type, scheduled_time, status)
    VALUES (NEW.id, '24h', reminder_24h, 'pending')
    ON CONFLICT DO NOTHING;
    
    -- Insert Day-Of reminder (Only if the appointment is actually in the future relative to 6am)
    IF reminder_day_of < appointment_datetime THEN
        INSERT INTO appointment_reminders (appointment_id, reminder_type, scheduled_time, status)
        VALUES (NEW.id, 'day_of', reminder_day_of, 'pending')
        ON CONFLICT DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Re-create View to include new reminder types if needed (optional, view usually selects *)
DROP VIEW IF EXISTS pending_reminders_to_send;
CREATE VIEW pending_reminders_to_send AS
SELECT
    ar.id,
    ar.appointment_id,
    ar.reminder_type,
    ar.scheduled_time,
    a.patient_name,
    a.patient_email,
    a.appointment_date,
    a.appointment_time,
    a.service_type
FROM appointment_reminders ar
JOIN appointments a ON ar.appointment_id = a.id
WHERE ar.status = 'pending'
AND ar.scheduled_time <= NOW()
ORDER BY ar.scheduled_time ASC;
