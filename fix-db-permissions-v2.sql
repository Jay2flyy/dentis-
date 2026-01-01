-- Fix Database Permissions (Robust Version)
-- This script safely drops existing policies before creating new ones to avoid "already exists" errors.

-- 1. Fix infinite recursion in admin_users
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users" ON admin_users FOR SELECT USING (auth.uid() = user_id);

-- 2. Fix permissions for PATIENTS table
DROP POLICY IF EXISTS "Anyone can create patient records" ON patients;
CREATE POLICY "Anyone can create patient records"
    ON patients FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Patients can view their own data by email" ON patients;
CREATE POLICY "Patients can view their own data by email"
    ON patients FOR SELECT
    USING (email = auth.jwt()->>'email');
