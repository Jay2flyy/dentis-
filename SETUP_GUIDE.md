# SmileCare Dental - Setup Guide

Complete step-by-step guide to get your dental practice website up and running.

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account (free tier works)
- A code editor (VS Code recommended)
- Basic understanding of React (optional but helpful)

## Step 1: Initial Setup

### 1.1 Install Dependencies

```bash
cd dental-practice-automation
npm install
```

This will install all required packages including:
- React, React Router, TypeScript
- Tailwind CSS for styling
- Supabase client for backend
- Framer Motion for animations
- And more...

### 1.2 Verify Installation

```bash
npm run dev
```

The app should start on `http://localhost:5173` (without backend features yet).

## Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (or create account)
4. Click "New Project"
5. Fill in:
   - **Name**: SmileCare Dental
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is fine to start
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### 2.2 Get API Credentials

Once project is ready:

1. Click on ⚙️ **Settings** (bottom left)
2. Go to **API** section
3. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 2.3 Create Environment File

1. In your project folder, copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and paste your credentials:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Database Schema

### 3.1 Open SQL Editor

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**

### 3.2 Run Schema

1. Open `supabase/schema.sql` from your project
2. Copy **ALL** the contents
3. Paste into the SQL Editor
4. Click **RUN** button (bottom right)
5. Wait for "Success" message

This creates:
- ✅ Tables: patients, appointments, leads, reviews, services, admin_users
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Sample services data
- ✅ Automatic triggers

### 3.3 Verify Tables

1. Click **Table Editor** (left sidebar)
2. You should see these tables:
   - patients
   - appointments
   - leads
   - reviews
   - services
   - admin_users

## Step 4: Create Admin User

### 4.1 Create Auth User

1. Go to **Authentication** > **Users**
2. Click **Add user** > **Create new user**
3. Fill in:
   - **Email**: admin@smilecare.com (or your email)
   - **Password**: Choose a strong password
   - **Auto Confirm User**: ✅ Check this
4. Click **Create user**
5. **Important**: Copy the **User ID** (UUID format)

### 4.2 Make User Admin

1. Go back to **SQL Editor**
2. Run this query (replace `USER_ID_HERE` with your copied ID):

```sql
INSERT INTO admin_users (user_id, role) 
VALUES ('USER_ID_HERE', 'admin');
```

3. Click **RUN**

## Step 5: Test Your Website

### 5.1 Start Development Server

```bash
npm run dev
```

### 5.2 Test Public Features

1. Open `http://localhost:5173`
2. ✅ Browse services
3. ✅ Try the chatbot (bottom right)
4. ✅ Go to `/booking` and create a test appointment
5. ✅ Submit contact form at `/contact`

### 5.3 Test Admin Features

1. Go to `http://localhost:5173/admin/login`
2. Login with your admin credentials
3. ✅ View dashboard statistics
4. ✅ See your test appointment
5. ✅ Try changing appointment status

## Step 6: Customization

### 6.1 Update Practice Information

**Footer Information** (`src/components/Footer.tsx`):
- Lines 40-45: Address
- Line 49: Phone number
- Line 53: Email

**Office Hours** (`src/components/Footer.tsx`):
- Lines 63-67: Update hours

**Hero Section** (`src/pages/HomePage.tsx`):
- Lines 55-62: Main headline and description

### 6.2 Customize Branding

**Colors** (`tailwind.config.js`):
```javascript
dental: {
  primary: '#0ea5e9',    // Main brand color
  secondary: '#06b6d4',  // Secondary color
  accent: '#14b8a6',     // Accent color
  // Change these to match your brand!
}
```

**Logo** (`src/components/Navbar.tsx`):
- Line 17-21: Replace with your logo
- Or update the gradient circle with your design

### 6.3 Add Your Services

Option 1 - Via SQL:
```sql
INSERT INTO services (name, description, duration, price, category) 
VALUES ('Your Service', 'Description here', 60, 199.99, 'Category');
```

Option 2 - Update in code:
- Edit `src/pages/BookingPage.tsx` lines 15-22

## Step 7: AI Chatbot Enhancement (Optional)

The chatbot works with pattern matching by default. To add real AI:

### 7.1 Get API Key

Choose one:
- **OpenAI**: [platform.openai.com](https://platform.openai.com)
- **Groq** (faster, free tier): [console.groq.com](https://console.groq.com)

### 7.2 Add to Environment

In `.env.local`:
```env
VITE_AI_API_KEY=your_api_key_here
VITE_AI_API_URL=https://api.openai.com/v1/chat/completions
```

### 7.3 Update Chatbot Code

In `src/components/ChatBot.tsx`, replace the `generateResponse` function with an API call to your AI service.

## Step 8: Email Notifications (Optional)

### 8.1 Setup Email Service

Choose:
- **Resend**: [resend.com](https://resend.com) (easiest)
- **SendGrid**: [sendgrid.com](https://sendgrid.com)
- **AWS SES**: More complex but cheaper at scale

### 8.2 Create Supabase Edge Function

```bash
# In supabase directory
supabase functions new send-booking-email
```

### 8.3 Configure Trigger

Set up database trigger to call email function on new appointments.

## Step 9: Production Deployment

### 9.1 Build for Production

```bash
npm run build
```

This creates optimized files in `dist/` folder.

### 9.2 Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"
7. Your site is live! 🎉

### 9.3 Alternative: Netlify

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

### 9.4 Custom Domain

1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel/Netlify, go to Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Wait 24-48 hours for DNS propagation

## Step 10: Going Live Checklist

Before launching to patients:

- [ ] Test all booking flows
- [ ] Verify email notifications work
- [ ] Test admin dashboard thoroughly
- [ ] Update all contact information
- [ ] Add your actual services and pricing
- [ ] Upload team photos
- [ ] Test on mobile devices
- [ ] Set up Google Analytics
- [ ] Create social media accounts
- [ ] Update privacy policy
- [ ] Test chatbot responses
- [ ] Backup database
- [ ] Set up monitoring (Sentry, LogRocket)

## Troubleshooting

### Issue: "Cannot read properties of null"
**Solution**: Make sure Supabase credentials are in `.env.local` and restart dev server.

### Issue: "Row Level Security policy violation"
**Solution**: Check that admin user is properly added to `admin_users` table.

### Issue: Appointments not showing in admin
**Solution**: Verify SQL schema ran completely, check browser console for errors.

### Issue: Chatbot not responding
**Solution**: This is normal - it uses simple pattern matching. Enhance with AI API for better responses.

### Issue: Build errors
**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again.

## Getting Help

- **Documentation**: Check README.md
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **React Docs**: [react.dev](https://react.dev)
- **Community**: Open an issue on GitHub

## Next Steps

1. **Marketing**: Add Google Ads, Facebook Ads
2. **SEO**: Optimize meta tags, add blog
3. **Reviews**: Integrate Google Reviews
4. **Analytics**: Track conversion rates
5. **Features**: Add online payments, SMS reminders

---

**Congratulations! Your dental practice website is now live! 🦷✨**
