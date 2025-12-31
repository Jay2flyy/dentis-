# 🧪 Create Test Users - Step by Step

## Quick Setup (5 Minutes)

### Option 1: Create Users via Signup Form (Easiest) ⭐

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:5173/login

3. **Create Patient Account:**
   - Click "Sign Up" tab
   - Enter:
     - Name: `John Patient`
     - Email: `patient@test.com`
     - Password: `Test123!@#`
   - Select: **Patient**
   - Click "Create Account"
   - ✅ Account created! Check email for verification (optional)

4. **Create Admin Account:**
   - Click "Sign Up" tab
   - Enter:
     - Name: `Admin User`
     - Email: `admin@test.com`
     - Password: `Admin123!@#`
   - Select: **Admin**
   - Click "Create Account"
   - ⚠️ **Important:** This creates the account but you need to add admin privileges (see step 5)

5. **Add Admin Privileges:**
   - Go to Supabase Dashboard: https://app.supabase.com
   - Select your project
   - Go to **SQL Editor**
   - Run this query:
   ```sql
   -- First, get the user_id
   SELECT id, email FROM auth.users WHERE email = 'admin@test.com';
   
   -- Copy the id, then run:
   INSERT INTO admin_users (user_id, role)
   VALUES ('paste-the-user-id-here', 'admin');
   ```

6. **Test Login:**
   - Go to http://localhost:5173/login
   - Try patient login → should go to `/patient-dashboard`
   - Try admin login → should go to `/admin/comprehensive`

---

### Option 2: Create Users via Supabase Dashboard

1. **Go to Supabase Dashboard:** https://app.supabase.com

2. **Navigate to Authentication:**
   - Click on your project
   - Go to **Authentication** → **Users**
   - Click **Add User**

3. **Create Patient User:**
   - Email: `patient@test.com`
   - Password: `Test123!@#`
   - Auto Confirm: ✅ (check this box)
   - Click **Create User**

4. **Create Admin User:**
   - Email: `admin@test.com`
   - Password: `Admin123!@#`
   - Auto Confirm: ✅
   - Click **Create User**

5. **Create Patient Record for Each User:**
   Go to **SQL Editor** and run:
   ```sql
   -- For patient user
   INSERT INTO patients (full_name, email, phone)
   VALUES ('John Patient', 'patient@test.com', '+1234567890');
   
   -- For admin user (optional, if they need patient features too)
   INSERT INTO patients (full_name, email, phone)
   VALUES ('Admin User', 'admin@test.com', '+1987654321');
   ```

6. **Grant Admin Privileges:**
   ```sql
   -- Get the admin user's ID
   SELECT id, email FROM auth.users WHERE email = 'admin@test.com';
   
   -- Use that ID to create admin record
   INSERT INTO admin_users (user_id, role)
   VALUES ('paste-user-id-here', 'admin');
   ```

---

## 🎯 Test Credentials

After setup, use these credentials:

### Patient Account
```
Email: patient@test.com
Password: Test123!@#
Dashboard: /patient-dashboard
```

### Admin Account
```
Email: admin@test.com
Password: Admin123!@#
Dashboard: /admin/comprehensive
```

---

## 🧪 Testing the Login

### Test 1: Patient Login
```bash
1. Go to: http://localhost:5173/login
2. Select: "Patient" 
3. Enter: patient@test.com / Test123!@#
4. Click: "Login"
5. ✅ Should redirect to: /patient-dashboard
6. ✅ Should see: Dashboard with stats and menus
```

### Test 2: Admin Login
```bash
1. Go to: http://localhost:5173/login
2. Select: "Admin"
3. Enter: admin@test.com / Admin123!@#
4. Click: "Login"
5. ✅ Should redirect to: /admin/comprehensive
6. ✅ Should see: Admin dashboard with patient management
```

### Test 3: Logout
```bash
1. In any dashboard
2. Click: "Sign Out" button (in sidebar)
3. ✅ Should redirect to: / (home page)
4. ✅ Try accessing dashboard again
5. ✅ Should redirect to: /login with error message
```

### Test 4: Admin Protection
```bash
1. Login as patient (patient@test.com)
2. Try accessing: http://localhost:5173/admin/comprehensive
3. ✅ Should redirect to: /patient-dashboard
4. ✅ Should see error: "Access denied. Admin privileges required."
```

---

## 🔍 Troubleshooting

### Issue: "Invalid login credentials"
**Solution:** 
- Make sure you created the user in Supabase
- Check email/password are correct
- If using signup form, check your email for verification link

### Issue: Admin dashboard redirects to patient dashboard
**Solution:**
```sql
-- Check if admin_users record exists
SELECT * FROM admin_users WHERE user_id = 'your-user-id';

-- If not, create it:
INSERT INTO admin_users (user_id, role)
VALUES ('your-user-id', 'admin');
```

### Issue: Dashboard shows "Loading..." forever
**Solution:**
- Check browser console for errors (F12)
- Verify Supabase credentials in `.env.local`
- Make sure tables are created (run all schema files)

### Issue: Images not loading
**Solution:**
- Images should be in root `dental-practice-automation/` folder
- They're already there! Check:
  - heroImage.webp
  - before and after.png
  - teeth whitening.png
  - etc.

---

## 📊 Verify Database Setup

Run this in Supabase SQL Editor to check everything is set up:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('patients', 'admin_users', 'appointments', 'loyalty_points');

-- Check users
SELECT id, email, created_at FROM auth.users;

-- Check admin users
SELECT au.*, u.email 
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id;

-- Check patients
SELECT id, full_name, email FROM patients;
```

Expected results:
- ✅ 4+ tables exist
- ✅ 2 users in auth.users
- ✅ 1 admin in admin_users
- ✅ 1-2 patients in patients table

---

## 🎉 Success Checklist

After creating users, verify:

- [ ] Patient login works → redirects to `/patient-dashboard`
- [ ] Admin login works → redirects to `/admin/comprehensive`
- [ ] Logout works → redirects to home
- [ ] Dashboard shows loading spinner initially
- [ ] Protected routes redirect to login
- [ ] Admin dashboard blocks non-admin users
- [ ] Images load on all pages
- [ ] Toast notifications show for errors/success

---

## 🚀 Next Steps

Once login is working:

1. **Add Test Data:**
   ```sql
   -- Add loyalty points for patient
   INSERT INTO loyalty_points (patient_id, points_balance, lifetime_points, tier_level)
   SELECT id, 500, 1200, 'Silver' FROM patients WHERE email = 'patient@test.com';
   
   -- Add test appointment
   INSERT INTO appointments (patient_name, patient_email, patient_phone, appointment_date, appointment_time, service_type, status)
   VALUES ('John Patient', 'patient@test.com', '+1234567890', '2024-12-25', '10:00 AM', 'General Checkup', 'confirmed');
   ```

2. **Test Dashboard Features:**
   - View appointments
   - Check loyalty points
   - Browse rewards catalog
   - View patient management (admin)
   - Test loyalty program admin

3. **Customize:**
   - Add more test data
   - Test reward redemptions
   - Try different scenarios

---

## 💡 Pro Tips

1. **Use Browser DevTools (F12):**
   - Console tab shows errors
   - Network tab shows API calls
   - Application tab shows session storage

2. **Check Supabase Logs:**
   - Dashboard → Logs → API
   - See authentication attempts
   - Debug RLS policy issues

3. **Test in Incognito Mode:**
   - Clean session
   - No cached credentials
   - Fresh start for testing

---

## 📞 Need Help?

If you're stuck:
1. Check browser console (F12) for errors
2. Check Supabase Dashboard → Logs
3. Verify `.env.local` has correct credentials
4. Make sure all schema files are run
5. Check `TEST_RESULTS.md` for detailed testing guide

---

**You're ready to test! 🎉**

The authentication system is fully functional and ready for use.
