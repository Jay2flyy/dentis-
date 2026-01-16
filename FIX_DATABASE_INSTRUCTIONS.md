# 🔧 Database Fixes - Instructions

## Issues Fixed
✅ **Row-level security policy violations** when uploading documents  
✅ **Admin access granted** to youngx997@gmail.com  
✅ **CRUD operations** fixed for both admin and patient dashboards

---

## 🚀 Quick Fix (5 Minutes)

### Step 1: Open Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project: **dmykngeptzepsdiypauu**
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Fix Script
1. Click **+ New Query**
2. Open the file: `fix-rls-policies.sql`
3. **Copy ALL the content** from the file
4. **Paste** into the SQL Editor
5. Click **RUN** (or press Ctrl+Enter)

### Step 3: Verify Success
You should see messages like:
```
NOTICE: Admin access granted to youngx997@gmail.com
NOTICE: RLS Policies Fix Complete!
```

And verification query results showing:
- youngx997@gmail.com listed as admin
- All RLS policies updated

---

## 🧪 Test the Fixes

### Test 1: Admin Access
1. **Logout** from the website (if logged in)
2. Go to: http://localhost:5173/login
3. **Login** with:
   - Email: `youngx997@gmail.com`
   - Password: (your password)
   - Select: **Admin**
4. **Expected**: Successfully access admin dashboard
5. **Try**: View patients, manage appointments, check all sections

### Test 2: Document Upload (Patient)
1. **Login** as patient: youngx997@gmail.com
2. Go to **Medical Records** section
3. Click **Upload Document**
4. Select a file and fill in details
5. Click **Upload**
6. **Expected**: ✅ Document uploads successfully (no RLS error)

### Test 3: Medical Aid Card Upload
1. Still logged in as patient
2. Go to **Medical Aid** section
3. Try to upload card front/back
4. **Expected**: ✅ Upload works without "row-level security policy" error

### Test 4: Admin CRUD Operations
1. **Login** as admin: youngx997@gmail.com
2. Test these operations:
   - ✅ **View** all patients
   - ✅ **Create** new appointment
   - ✅ **Update** patient information
   - ✅ **Delete** test appointments
   - ✅ **Upload** documents for patients
   - ✅ **Manage** medical records

### Test 5: Patient CRUD Operations
1. **Login** as regular patient
2. Test these operations:
   - ✅ **View** your own appointments
   - ✅ **Update** your profile
   - ✅ **Upload** your documents
   - ✅ **View** your medical history
   - ✅ **Cannot** see other patients' data

---

## 🔍 What Was Fixed?

### 1. Medical Documents Table
**Before:** Patients couldn't upload documents (RLS violation)  
**After:** 
- ✅ Patients can upload their own documents
- ✅ Patients can view/update/delete their documents
- ✅ Admins have full access to all documents

### 2. Patient Medical Info Table
**Before:** Similar RLS violations  
**After:**
- ✅ Patients can add/update their medical info
- ✅ Patients can view their own data
- ✅ Admins have full access

### 3. Patients Table
**Before:** Limited update capabilities  
**After:**
- ✅ Patients can update their own profile
- ✅ Admins can manage all patients

### 4. Appointments Table
**Before:** Update restrictions  
**After:**
- ✅ Patients can update their appointments
- ✅ Anyone can create appointments (booking)
- ✅ Admins have full control

### 5. Admin Access
**Before:** youngx997@gmail.com had no admin privileges  
**After:**
- ✅ Full admin access granted
- ✅ Can access admin dashboard
- ✅ Can manage all data

---

## 📊 Database Changes Summary

### Policies Created/Updated: 20+

#### Medical Documents (5 policies):
1. Admins can manage all medical documents
2. Patients can view their own medical documents
3. Authenticated users can upload their medical documents
4. Patients can update their medical documents
5. Patients can delete their medical documents

#### Patient Medical Info (4 policies):
1. Admins can manage all patient medical info
2. Patients can view their own medical info
3. Patients can add their own medical info
4. Patients can update their medical info

#### Patients Table (3 policies):
1. Admins can manage all patients
2. Patients can view their own data
3. Patients can update their own data

#### Appointments (4 policies):
1. Anyone can create appointments
2. Admins can manage all appointments
3. Patients can view their appointments
4. Patients can update their appointments

#### Other Tables (4 policies):
- Dental History (2 policies)
- Treatment Plans (2 policies)
- Prescriptions (2 policies)

---

## 🛡️ Security Notes

### What the RLS Policies Do:

**Admins:**
- Full access to ALL tables
- Can create, read, update, delete any record
- Verified by checking `admin_users` table

**Patients:**
- Can ONLY access their own data
- Identified by email match or patient_id
- Cannot see other patients' information

**Public/Anonymous:**
- Can create appointments (booking form)
- Can view approved reviews
- Can view active services
- Limited read-only access

### Data Isolation:
```
Patient A (john@example.com)
  ✅ Can see: His appointments, records, documents
  ❌ Cannot see: Other patients' data

Patient B (jane@example.com)
  ✅ Can see: Her appointments, records, documents
  ❌ Cannot see: Other patients' data

Admin (youngx997@gmail.com)
  ✅ Can see: EVERYTHING
  ✅ Can manage: EVERYTHING
```

---

## 🔧 Troubleshooting

### Issue: "User youngx997@gmail.com not found"
**Solution:**
1. Make sure you've created an account at `/login`
2. Sign up first with youngx997@gmail.com
3. Then run the SQL script again

### Issue: Still getting RLS errors
**Solution:**
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Logout completely** from the website
3. **Close all browser tabs**
4. **Login again**
5. Session tokens might be cached

### Issue: Admin dashboard shows "Access denied"
**Solution:**
1. Verify admin_users table:
```sql
SELECT u.email, au.role 
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE u.email = 'youngx997@gmail.com';
```
2. Should return a row with role 'admin'
3. If not, run the fix script again

### Issue: Can't upload documents
**Solution:**
1. Check if medical_documents table exists:
```sql
SELECT * FROM information_schema.tables 
WHERE table_name = 'medical_documents';
```
2. Check RLS policies:
```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'medical_documents';
```
3. Should show 5 policies

### Issue: Patient can see other patients' data
**Solution:** This should NOT happen. If it does:
1. Re-run the fix script immediately
2. Check browser console for errors
3. Verify the patient_id matching in queries

---

## 📱 Quick Test Commands

### Check Admin Access:
```sql
-- In Supabase SQL Editor
SELECT u.email, au.role, au.created_at
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id;
```

### Check RLS Policies:
```sql
-- In Supabase SQL Editor
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('medical_documents', 'patients', 'appointments')
ORDER BY tablename, policyname;
```

### Check Patient Data:
```sql
-- In Supabase SQL Editor
SELECT email, full_name, created_at
FROM patients
WHERE email = 'youngx997@gmail.com';
```

---

## ✅ Success Checklist

After running the script, verify:

- [ ] SQL script executed without errors
- [ ] Admin access granted to youngx997@gmail.com
- [ ] Can login as admin
- [ ] Can access admin dashboard
- [ ] Can view all patients in admin panel
- [ ] Can upload documents as patient (no RLS error)
- [ ] Can upload medical aid card images
- [ ] Can update patient profile
- [ ] Can create/update appointments
- [ ] Cannot see other patients' data as regular patient

---

## 🆘 Need Help?

### Common Error Messages:

**Error:** `new row violates row-level security policy`  
**Fix:** Re-run the fix-rls-policies.sql script

**Error:** `Access denied. Admin privileges required.`  
**Fix:** Verify admin_users table has your email

**Error:** `permission denied for table`  
**Fix:** Check Supabase project settings → Database → Roles

### Still Having Issues?

1. **Check browser console** (F12) for detailed errors
2. **Check Supabase logs** in dashboard
3. **Verify environment variables** in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://dmykngeptzepsdiypauu.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Restart dev server**: `npm run dev`

---

## 🎉 You're Done!

Your database is now properly configured with:
- ✅ Secure RLS policies
- ✅ Admin access for youngx997@gmail.com
- ✅ Working CRUD operations
- ✅ Document upload capabilities
- ✅ Proper data isolation

**Go test your dashboards now!**

---

**Last Updated:** January 1, 2026  
**Script File:** fix-rls-policies.sql  
**Status:** Ready to Apply ✅
