# 🚀 Developer Quick Reference

## 📍 Routes

### Patient Routes
```
/patient-dashboard          → Comprehensive Patient Dashboard ⭐
/patient-portal            → Basic Patient Portal (old)
/booking                   → Book Appointment
/login                     → Patient Login
```

### Admin Routes
```
/admin/comprehensive       → Comprehensive Admin Dashboard ⭐
/admin/dashboard          → Basic Admin Dashboard (old)
/login                    → Admin Login
```

### Public Routes
```
/                         → Home
/services                 → Services
/about                    → About
/contact                  → Contact
/faq                      → FAQ
/transformations          → Before/After Gallery
```

---

## 📁 Project Structure

```
dental-practice-automation/
├── supabase/
│   ├── schema.sql                          # Base schema
│   ├── loyalty_schema.sql                  # Loyalty program
│   ├── medical_records_schema.sql          # Medical records
│   ├── billing_schema.sql                  # Billing system
│   └── family_communication_schema.sql     # Communications
│
├── src/
│   ├── components/
│   │   ├── PatientDashboard/
│   │   │   ├── DashboardOverview.tsx
│   │   │   ├── AppointmentsSection.tsx
│   │   │   ├── LoyaltySection.tsx
│   │   │   ├── MedicalRecordsSection.tsx
│   │   │   └── BillingSection.tsx
│   │   │
│   │   └── AdminDashboard/
│   │       ├── AdminOverview.tsx
│   │       ├── PatientsManagement.tsx
│   │       └── LoyaltyManagement.tsx
│   │
│   ├── pages/
│   │   ├── ComprehensivePatientDashboard.tsx
│   │   └── ComprehensiveAdminDashboard.tsx
│   │
│   ├── types.ts                            # All TypeScript types
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── lib/
│       └── supabase.ts
│
├── QUICK_SETUP.md                          # 5-min setup guide
├── COMPREHENSIVE_DASHBOARD_GUIDE.md        # Full documentation
└── IMPLEMENTATION_SUMMARY.md               # What's completed
```

---

## 🗄️ Key Database Tables

### Core
```sql
patients                    -- Patient info
appointments               -- Bookings
services                   -- Service catalog
admin_users               -- Admin auth
```

### Loyalty
```sql
loyalty_points            -- Points balance
points_transactions       -- Points history
rewards_catalog           -- Rewards list
reward_redemptions        -- Redemption requests
referrals                 -- Referral tracking
```

### Medical
```sql
dental_history            -- Procedures
medical_documents         -- Files/X-rays
treatment_plans           -- Treatment plans
prescriptions             -- Medications
patient_medical_info      -- Allergies/conditions
```

### Billing
```sql
invoices                  -- Invoices
invoice_items             -- Line items
payments                  -- Payment records
payment_plans             -- Installment plans
insurance_info            -- Insurance details
```

---

## 🎨 Component Props Quick Reference

### DashboardOverview
```typescript
interface DashboardOverviewProps {
  stats: PatientDashboardStats;
  nextAppointment?: Appointment;
  loyaltyPoints?: LoyaltyPoints;
  onNavigate: (section: string) => void;
}
```

### LoyaltySection
```typescript
interface LoyaltySectionProps {
  loyaltyPoints: LoyaltyPoints;
  rewards: Reward[];
  transactions: PointsTransaction[];
  redemptions: RewardRedemption[];
  referrals: Referral[];
  onRedeemReward: (rewardId: string) => void;
}
```

### PatientsManagement
```typescript
interface PatientsManagementProps {
  patients: Patient[];
  onAddPatient: () => void;
  onEditPatient: (patientId: string) => void;
  onViewDetails: (patientId: string) => void;
}
```

---

## 🔧 Environment Variables

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

---

## 💾 Common Supabase Queries

### Get Patient Dashboard Data
```typescript
const { data: appointments } = await supabase
  .from('appointments')
  .select('*')
  .eq('patient_id', patientId)
  .order('appointment_date', { ascending: false });

const { data: loyaltyPoints } = await supabase
  .from('loyalty_points')
  .select('*')
  .eq('patient_id', patientId)
  .single();
```

### Get Loyalty Transactions
```typescript
const { data: transactions } = await supabase
  .from('points_transactions')
  .select('*')
  .eq('patient_id', patientId)
  .order('created_at', { ascending: false })
  .limit(50);
```

### Redeem Reward
```typescript
const { data, error } = await supabase
  .from('reward_redemptions')
  .insert({
    patient_id: patientId,
    reward_id: rewardId,
    points_spent: pointsRequired,
    status: 'pending'
  })
  .select()
  .single();
```

### Approve Redemption (Admin)
```typescript
const { error } = await supabase
  .from('reward_redemptions')
  .update({ status: 'approved', fulfilled_at: new Date().toISOString() })
  .eq('id', redemptionId);
```

### Search Patients (Admin)
```typescript
const { data: patients } = await supabase
  .from('patients')
  .select(`
    *,
    loyalty_points(*),
    appointments(count)
  `)
  .ilike('full_name', `%${searchTerm}%`)
  .order('created_at', { ascending: false });
```

---

## 🎁 Loyalty Points Configuration

### Default Points
```javascript
const POINTS = {
  // Services
  checkup: 50,
  cleaning: 75,
  filling: 100,
  rootCanal: 150,
  whitening: 200,
  crown: 250,
  implant: 500,
  
  // Actions
  referral: 200,
  review: 25,
  birthday: 100,
  anniversary: 150
};
```

### Membership Tiers
```javascript
const TIERS = {
  Bronze: { min: 0, max: 499, discount: 0 },
  Silver: { min: 500, max: 999, discount: 10 },
  Gold: { min: 1000, max: 1999, discount: 15 },
  Platinum: { min: 2000, max: Infinity, discount: 20 }
};
```

---

## 🎨 Tailwind Color Classes

### Status Colors
```css
/* Success */
bg-green-100 text-green-800

/* Warning */
bg-yellow-100 text-yellow-800

/* Error */
bg-red-100 text-red-800

/* Info */
bg-blue-100 text-blue-800

/* Pending */
bg-gray-100 text-gray-800
```

### Gradients
```css
/* Primary */
bg-gradient-to-r from-blue-600 to-teal-600

/* Secondary */
bg-gradient-to-r from-purple-600 to-pink-600

/* Admin */
bg-gradient-to-b from-indigo-900 to-purple-900
```

---

## 🔔 Toast Notifications

```typescript
import toast from 'react-hot-toast';

// Success
toast.success('Operation successful!');

// Error
toast.error('Something went wrong!');

// Info
toast.info('Please note...');

// Loading
const toastId = toast.loading('Processing...');
toast.success('Done!', { id: toastId });
```

---

## 🎭 Framer Motion Animations

### Fade In
```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>
```

### Slide Up
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>
```

### Hover Scale
```typescript
<motion.div
  whileHover={{ scale: 1.02 }}
  className="cursor-pointer"
/>
```

---

## 🧪 Test Data Inserts

### Create Test Patient
```sql
INSERT INTO patients (full_name, email, phone)
VALUES ('John Doe', 'john@test.com', '+1234567890')
RETURNING id;

-- Add loyalty points
INSERT INTO loyalty_points (patient_id, points_balance, lifetime_points, tier_level)
VALUES ('patient-id-here', 500, 1200, 'Silver');
```

### Create Test Reward
```sql
INSERT INTO rewards_catalog (name, description, points_required, category, active)
VALUES ('Test Reward', 'Testing reward system', 100, 'test', true);
```

### Create Test Appointment
```sql
INSERT INTO appointments (
  patient_id, patient_name, patient_email, patient_phone,
  appointment_date, appointment_time, service_type, status
)
VALUES (
  'patient-id-here', 'John Doe', 'john@test.com', '+1234567890',
  '2024-01-20', '10:00 AM', 'General Checkup', 'confirmed'
);
```

---

## 🚨 Common Issues & Solutions

### Issue: RLS Policy Error
```
Solution: Check admin_users table has your auth user_id
```
```sql
INSERT INTO admin_users (user_id, role)
VALUES ('your-supabase-auth-user-id', 'admin');
```

### Issue: Empty Dashboard
```
Solution: Add test data using SQL inserts above
```

### Issue: TypeScript Errors
```bash
# Restart TypeScript server in VSCode
Cmd+Shift+P → TypeScript: Restart TS Server
```

### Issue: Build Errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 NPM Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
```

---

## 🔍 Debugging Tips

### Check Supabase Connection
```typescript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('User:', user);
```

### Log API Responses
```typescript
const { data, error } = await supabase.from('table').select('*');
console.log('Data:', data);
console.log('Error:', error);
```

### Check RLS Policies
```sql
-- View policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test as user
SET request.jwt.claim.email = 'test@example.com';
```

---

## 📚 Key Dependencies

```json
{
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^10.0.0",
  "react-router-dom": "^6.20.0",
  "@supabase/supabase-js": "^2.38.0",
  "lucide-react": "^0.300.0",
  "react-hot-toast": "^2.4.1"
}
```

---

## 🎯 Quick Commands

```bash
# Setup
npm install
cp .env.example .env.local
# Add Supabase credentials to .env.local
npm run dev

# Deploy
npm run build
# Upload dist/ to hosting

# Test
# Visit /patient-dashboard
# Visit /admin/comprehensive
```

---

## 📊 Status Badges

```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
```

---

## 🎨 Icon Usage

```typescript
import { Calendar, User, Gift, DollarSign } from 'lucide-react';

<Calendar size={24} className="text-blue-600" />
<User size={20} />
<Gift size={32} className="text-purple-600" />
```

---

## ⚡ Performance Tips

1. Use `React.memo()` for expensive components
2. Lazy load routes with `React.lazy()`
3. Optimize images (use WebP)
4. Enable Supabase caching
5. Use pagination for large lists
6. Debounce search inputs

---

## 📱 Responsive Breakpoints

```css
sm:   640px   /* Small devices */
md:   768px   /* Tablets */
lg:   1024px  /* Laptops */
xl:   1280px  /* Desktops */
2xl:  1536px  /* Large screens */
```

---

## 🔐 Security Checklist

- ✅ RLS policies enabled
- ✅ Authentication required
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ⏳ Rate limiting (add)
- ⏳ CORS configuration (add)

---

## 📞 Quick Links

- [Supabase Dashboard](https://app.supabase.com)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)
- [React Router](https://reactrouter.com)

---

**💡 Pro Tip:** Keep this file open in a split pane while developing!

---

Last Updated: December 2024
