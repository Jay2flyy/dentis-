-- Fix Database Permissions
-- Run this in Supabase SQL Editor to fix all booking errors

-- 1. Fix infinite recursion in admin_users (if not already done)
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users" ON admin_users FOR SELECT USING (auth.uid() = user_id);

-- 2. Fix "new row violates row-level security policy for table patients"
-- This allows the booking system to automatically create patient records
CREATE POLICY "Anyone can create patient records"
    ON patients FOR INSERT
    WITH CHECK (true);

-- 3. Allow patients to see their own created records immediately
CREATE POLICY "Patients can view their own data by email"
    ON patients FOR SELECT
    USING (email = auth.jwt()->>'email');
