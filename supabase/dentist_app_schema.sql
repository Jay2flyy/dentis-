-- DentistApp Schema
-- This script creates the tables required for the Thandi AI Voice Assistant

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS public."DentistApp_patients" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    insurance_provider TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Appointments Table
CREATE TABLE IF NOT EXISTS public."DentistApp_appointments" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_email TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_phone TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    reason_for_visit TEXT DEFAULT 'General Checkup',
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "DentistApp_appointments_patient_email_fkey" FOREIGN KEY (patient_email) REFERENCES public."DentistApp_patients"(email) ON DELETE CASCADE
);

-- 3. Conversations Table (for Analytics)
CREATE TABLE IF NOT EXISTS public."DentistApp_conversations" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_email TEXT,
    session_id TEXT NOT NULL,
    message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant')),
    message_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public."DentistApp_patients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DentistApp_appointments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."DentistApp_conversations" ENABLE ROW LEVEL SECURITY;

-- Policies
-- NOTE: For production, you should tighten these up.
-- For now, we allow the service role (backend) to do everything, 
-- and the anon key (frontend) can do basic inserts/lookups.

CREATE POLICY "Enable read access for all users" ON public."DentistApp_patients" FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public."DentistApp_patients" FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public."DentistApp_appointments" FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public."DentistApp_appointments" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public."DentistApp_appointments" FOR UPDATE USING (true);

CREATE POLICY "Enable insert access for all users" ON public."DentistApp_conversations" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for admins" ON public."DentistApp_conversations" FOR SELECT USING (true); -- Should be restricted to admins
