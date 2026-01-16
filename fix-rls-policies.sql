-- Fix RLS Policies and Grant Admin Access
-- This script addresses row-level security violations and admin access issues

-- ==============================================
-- STEP 1: Grant Admin Access to youngx997@gmail.com
-- ==============================================

-- First, let's get the user_id for youngx997@gmail.com and add as admin
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get the user_id from auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'youngx997@gmail.com';
    
    -- If user exists, add them as admin
    IF v_user_id IS NOT NULL THEN
        INSERT INTO admin_users (user_id, role)
        VALUES (v_user_id, 'admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
        
        RAISE NOTICE 'Admin access granted to youngx997@gmail.com';
    ELSE
        RAISE NOTICE 'User youngx997@gmail.com not found. Please create account first.';
    END IF;
END $$;

-- ==============================================
-- STEP 2: Fix Medical Documents RLS Policies
-- ==============================================

-- Drop existing policies for medical_documents
DROP POLICY IF EXISTS "Patients can view their medical documents" ON medical_documents;
DROP POLICY IF EXISTS "Patients can upload documents" ON medical_documents;
DROP POLICY IF EXISTS "Admins can manage medical documents" ON medical_documents;

-- Create more permissive policies for medical_documents
-- Allow admins full access
CREATE POLICY "Admins can manage all medical documents"
    ON medical_documents FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Allow patients to view their own documents
CREATE POLICY "Patients can view their own medical documents"
    ON medical_documents FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users) 
        OR 
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
        OR
        auth.uid()::text = patient_id::text
    );

-- Allow authenticated users to insert documents for their own patient record
CREATE POLICY "Authenticated users can upload their medical documents"
    ON medical_documents FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL 
        AND (
            auth.uid() IN (SELECT user_id FROM admin_users)
            OR
            patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
            OR
            auth.uid()::text = patient_id::text
        )
    );

-- Allow patients to update their own documents
CREATE POLICY "Patients can update their medical documents"
    ON medical_documents FOR UPDATE
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
        OR
        auth.uid()::text = patient_id::text
    );

-- Allow patients to delete their own documents
CREATE POLICY "Patients can delete their medical documents"
    ON medical_documents FOR DELETE
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
        OR
        auth.uid()::text = patient_id::text
    );

-- ==============================================
-- STEP 3: Fix Patient Medical Info RLS Policies
-- ==============================================

DROP POLICY IF EXISTS "Patients can view their medical info" ON patient_medical_info;
DROP POLICY IF EXISTS "Patients can add their medical info" ON patient_medical_info;
DROP POLICY IF EXISTS "Admins can manage patient medical info" ON patient_medical_info;

-- Admins can do everything
CREATE POLICY "Admins can manage all patient medical info"
    ON patient_medical_info FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Patients can view their own info
CREATE POLICY "Patients can view their own medical info"
    ON patient_medical_info FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
        OR
        auth.uid()::text = patient_id::text
    );

-- Patients can add their own info
CREATE POLICY "Patients can add their own medical info"
    ON patient_medical_info FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL
        AND (
            auth.uid() IN (SELECT user_id FROM admin_users)
            OR
            patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
            OR
            auth.uid()::text = patient_id::text
        )
    );

-- Patients can update their own info
CREATE POLICY "Patients can update their medical info"
    ON patient_medical_info FOR UPDATE
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
        OR
        auth.uid()::text = patient_id::text
    );

-- ==============================================
-- STEP 4: Fix Patients Table RLS Policies
-- ==============================================

DROP POLICY IF EXISTS "Patients can view their own data" ON patients;
DROP POLICY IF EXISTS "Admins can manage patients" ON patients;

-- Admins can do everything
CREATE POLICY "Admins can manage all patients"
    ON patients FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Patients can view their own data
CREATE POLICY "Patients can view their own data"
    ON patients FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        email = auth.jwt()->>'email'
        OR
        auth.uid()::text = id::text
    );

-- Patients can update their own data
CREATE POLICY "Patients can update their own data"
    ON patients FOR UPDATE
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        email = auth.jwt()->>'email'
        OR
        auth.uid()::text = id::text
    );

-- ==============================================
-- STEP 5: Fix Appointments RLS Policies
-- ==============================================

DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can view their appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can manage appointments" ON appointments;

-- Anyone can create appointments (for booking)
CREATE POLICY "Anyone can create appointments"
    ON appointments FOR INSERT
    WITH CHECK (true);

-- Admins can do everything
CREATE POLICY "Admins can manage all appointments"
    ON appointments FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Patients can view their appointments
CREATE POLICY "Patients can view their appointments"
    ON appointments FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        patient_email = auth.jwt()->>'email'
        OR
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
    );

-- Patients can update their own appointments
CREATE POLICY "Patients can update their appointments"
    ON appointments FOR UPDATE
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        patient_email = auth.jwt()->>'email'
        OR
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
    );

-- ==============================================
-- STEP 6: Fix Dental History RLS Policies
-- ==============================================

DROP POLICY IF EXISTS "Patients can view their dental history" ON dental_history;
DROP POLICY IF EXISTS "Admins can manage dental history" ON dental_history;

-- Admins can do everything
CREATE POLICY "Admins can manage all dental history"
    ON dental_history FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Patients can view their dental history
CREATE POLICY "Patients can view their dental history"
    ON dental_history FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
        OR
        auth.uid()::text = patient_id::text
    );

-- ==============================================
-- STEP 7: Fix Treatment Plans RLS Policies
-- ==============================================

DROP POLICY IF EXISTS "Patients can view their treatment plans" ON treatment_plans;
DROP POLICY IF EXISTS "Admins can manage treatment plans" ON treatment_plans;

-- Admins can do everything
CREATE POLICY "Admins can manage all treatment plans"
    ON treatment_plans FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Patients can view their treatment plans
CREATE POLICY "Patients can view their treatment plans"
    ON treatment_plans FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
        OR
        auth.uid()::text = patient_id::text
    );

-- ==============================================
-- STEP 8: Fix Prescriptions RLS Policies
-- ==============================================

DROP POLICY IF EXISTS "Patients can view their prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Admins can manage prescriptions" ON prescriptions;

-- Admins can do everything
CREATE POLICY "Admins can manage all prescriptions"
    ON prescriptions FOR ALL
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Patients can view their prescriptions
CREATE POLICY "Patients can view their prescriptions"
    ON prescriptions FOR SELECT
    USING (
        auth.uid() IN (SELECT user_id FROM admin_users)
        OR
        patient_id IN (SELECT id FROM patients WHERE email = auth.jwt()->>'email')
        OR
        auth.uid()::text = patient_id::text
    );

-- ==============================================
-- STEP 9: Ensure Storage Bucket Policies (if using Supabase Storage)
-- ==============================================

-- Note: If you're using Supabase Storage for file uploads, you may need to
-- configure bucket policies in the Supabase dashboard as well.
-- This script handles database RLS only.

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Check if admin was added successfully
SELECT 
    au.id,
    au.user_id,
    au.role,
    u.email,
    au.created_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE u.email = 'youngx997@gmail.com';

-- List all admin users
SELECT 
    u.email,
    au.role,
    au.created_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
ORDER BY au.created_at DESC;

-- Show all RLS policies for medical_documents
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'medical_documents';

-- ==============================================
-- COMPLETION MESSAGE
-- ==============================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'RLS Policies Fix Complete!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '1. ✓ Added/Updated admin access for youngx997@gmail.com';
    RAISE NOTICE '2. ✓ Fixed medical_documents RLS policies';
    RAISE NOTICE '3. ✓ Fixed patient_medical_info RLS policies';
    RAISE NOTICE '4. ✓ Fixed patients table RLS policies';
    RAISE NOTICE '5. ✓ Fixed appointments RLS policies';
    RAISE NOTICE '6. ✓ Fixed dental_history RLS policies';
    RAISE NOTICE '7. ✓ Fixed treatment_plans RLS policies';
    RAISE NOTICE '8. ✓ Fixed prescriptions RLS policies';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Test document upload as youngx997@gmail.com';
    RAISE NOTICE '2. Test admin dashboard access';
    RAISE NOTICE '3. Test patient dashboard CRUD operations';
    RAISE NOTICE '==============================================';
END $$;
