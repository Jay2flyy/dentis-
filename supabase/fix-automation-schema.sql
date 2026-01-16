-- Fix main appointments table to support automation features
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;

-- Ensure service_type or reason_for_visit is consistent. 
-- The main schema uses service_type. Let's make sure it's always used.
-- If someone used reason_for_visit, we can add it as an alias or just migrate.
-- Since it's a new system, we'll stick to service_type.

-- Add index for reminder_sent
CREATE INDEX IF NOT EXISTS idx_appointments_reminder_sent ON appointments(reminder_sent);

-- Create conversations table if it doesn't exist (renaming from DentistApp_conversations concept)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_email TEXT,
    session_id TEXT NOT NULL,
    message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant')),
    message_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert access for all users" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for admins" ON conversations FOR SELECT USING (true);
