-- Ultimate Database Fix
-- This script fixes both the permissions error and ensures appointments are correctly linked.

-- 1. Update the Trigger Function to run as Admin (SECURITY DEFINER)
-- This allows the system to create/find patients even if the user is anonymous
CREATE OR REPLACE FUNCTION create_patient_from_appointment()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if patient exists
    IF NOT EXISTS (SELECT 1 FROM patients WHERE email = NEW.patient_email) THEN
        INSERT INTO patients (full_name, email, phone)
        VALUES (NEW.patient_name, NEW.patient_email, NEW.patient_phone)
        ON CONFLICT (email) DO NOTHING;
    END IF;
    
    -- Link appointment to patient
    NEW.patient_id := (SELECT id FROM patients WHERE email = NEW.patient_email);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Fix Infinite Recursion in Admin Policy
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users" ON admin_users FOR SELECT USING (auth.uid() = user_id);

-- 3. Ensure Patients table allows inserts (Backup safety)
DROP POLICY IF EXISTS "Anyone can create patient records" ON patients;
CREATE POLICY "Anyone can create patient records"
    ON patients FOR INSERT
    WITH CHECK (true);
