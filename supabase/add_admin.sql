-- Add admin user
INSERT INTO admin_users (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'youngx997@gmail.com'
ON CONFLICT (user_id) DO NOTHING;
