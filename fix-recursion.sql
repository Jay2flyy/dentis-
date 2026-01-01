-- Fix infinite recursion in RLS policies

-- 1. Drop the problematic policy on admin_users
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- 2. Create a safe policy that doesn't reference the table itself recursively
-- This allows any authenticated user to check if THEY are in the admin_users table
CREATE POLICY "Admins can view admin users"
    ON admin_users FOR SELECT
    USING (auth.uid() = user_id);
