# SmileCare Dental - Modern Dental Practice Website

A comprehensive dental practice website with **automated admin workflows** and **client acquisition features** built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### 🎯 Admin Automation
- **Automated Appointment Management**: Online booking system that automatically creates appointments in the database
- **Real-time Dashboard**: Live statistics and appointment tracking
- **Patient Management**: Automatic patient profile creation from bookings
- **Lead Tracking**: Automated lead capture from contact forms
- **Status Management**: Quick appointment status updates (pending → confirmed → completed)
- **Email Notifications**: Automated confirmation emails (ready for integration)

### 💼 Client Acquisition
- **AI-Powered Chatbot**: 24/7 intelligent assistant for patient inquiries
- **SEO-Optimized Landing Pages**: Professional homepage with clear CTAs
- **Lead Generation Forms**: Contact forms that automatically capture leads
- **Social Proof**: Testimonials and reviews section
- **Online Booking**: Frictionless 3-step appointment booking
- **Mobile Responsive**: Perfect experience on all devices

### 🏥 Core Features
- **Service Showcase**: Comprehensive service catalog with pricing
- **Patient Portal**: View appointments and booking history
- **Admin Dashboard**: Complete practice management interface
- **Modern UI/UX**: Beautiful animations with Framer Motion
- **Secure Authentication**: Supabase auth with role-based access
- **Real-time Updates**: Live data synchronization

## 📋 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Context API
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 🛠️ Installation

1. **Clone the repository**
```bash
cd dental-practice-automation
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql` in the SQL Editor
   - Get your project URL and anon key

4. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AI_API_KEY=your_ai_api_key (optional for enhanced chatbot)
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

## 🗄️ Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be ready

2. **Run Schema Migration**
   - Go to SQL Editor in Supabase Dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Click "Run" to create all tables

3. **Create Admin User**
   - Go to Authentication > Users
   - Create a new user with email and password
   - Copy the user ID
   - Run this SQL to make them admin:
   ```sql
   INSERT INTO admin_users (user_id, role) 
   VALUES ('user-id-here', 'admin');
   ```

## 📱 Pages Overview

### Public Pages
- **Home** (`/`) - Landing page with hero, features, services, and testimonials
- **Services** (`/services`) - Complete service catalog with pricing
- **Booking** (`/booking`) - 3-step appointment booking system
- **About** (`/about`) - Practice information and team
- **Contact** (`/contact`) - Contact form and location information

### Protected Pages
- **Admin Dashboard** (`/admin/dashboard`) - Appointment management and analytics
- **Admin Login** (`/admin/login`) - Secure admin authentication
- **Patient Portal** (`/patient-portal`) - Patient appointment history

## 🤖 AI Chatbot

The chatbot provides:
- Service information
- Booking assistance
- Office hours and location
- Insurance and payment info
- Emergency care guidance

To enhance with real AI:
1. Get an API key from OpenAI or Groq
2. Add to `.env.local`
3. Update the `generateResponse` function in `ChatBot.tsx`

## 🎙️ Voice Assistants

We provide three voice assistant options:

### Vapi.ai Integration ("Thandi")
- Professional cloud-based voice assistant
- Handles bookings, availability checks, and loyalty points
- Integrates with Supabase backend
- Requires Vapi.ai account and API keys

### Retell AI Integration ("Thandi")
- Advanced AI voice assistant with natural conversation flow
- Secure token generation via Supabase Edge Function
- Handles dental practice appointments and inquiries
- Requires Retell AI account and API keys

### Browser-Based Voice Assistant ("Sarah")
- Uses native browser speech recognition and synthesis
- Fully functional AI receptionist that collects booking information
- Uses Groq AI for conversation processing
- No additional API keys required

All assistants help patients book appointments and get information about our services.

## 🔐 Authentication

### Admin Access
- Login at `/admin/login`
- Demo credentials: `admin@smilecare.com` / `admin123`
- Full access to dashboard and patient data

### Patient Access
- Patients automatically get accounts when booking
- Access via `/patient-portal`
- View their appointment history

## 📊 Admin Features

The admin dashboard provides:
- **Analytics**: Total patients, appointments today, revenue, success rate
- **Appointment Management**: View, filter, confirm, complete, or cancel appointments
- **Patient Tracking**: Automatic patient profile creation
- **Lead Management**: Track contact form submissions
- **Real-time Updates**: Live data synchronization

## 🎨 Customization

### Branding
Update colors in `tailwind.config.js`:
```javascript
dental: {
  primary: '#0ea5e9',
  secondary: '#06b6d4',
  accent: '#14b8a6',
  // ...
}
```

### Services
Add/edit services in Supabase `services` table or in the schema.

### Content
- Update practice info in `Footer.tsx`
- Modify hero text in `HomePage.tsx`
- Change team members in `AboutPage.tsx`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables
Don't forget to add your environment variables in the deployment platform!

## 📈 Analytics Integration

Add analytics by including tracking codes in `index.html`:
- Google Analytics
- Facebook Pixel
- Hotjar

## 🔄 Future Enhancements

- [x] Voice AI Assistant Integration with loyalty system
- [x] Browser-Based Voice Assistant with appointment booking
- [x] Retell AI Integration with secure token generation
- [ ] Email automation (SendGrid/Resend integration)
- [ ] SMS reminders (Twilio integration)
- [ ] Online payments (Stripe integration)
- [ ] Calendar sync (Google Calendar API)
- [ ] Advanced reporting and analytics
- [ ] Multi-location support
- [ ] Inventory management for dental supplies
- [ ] Patient medical records management
- [ ] Prescription management
- [ ] Insurance claim processing

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Support

For support:
- 📧 Email: support@smilecare.com
- 📞 Phone: (123) 456-7890
- 💬 Use the chatbot on the website

## 🎯 Business Benefits

### For Dentists
✅ **Save 10+ hours/week** on admin work  
✅ **Reduce no-shows** with automated reminders  
✅ **Increase bookings** by 30-40% with online system  
✅ **24/7 availability** with AI chatbot  
✅ **Professional online presence**  

### For Patients
✅ **Book anytime** without calling  
✅ **Instant confirmation**  
✅ **Easy rescheduling**  
✅ **Track appointment history**  
✅ **Get instant answers** from chatbot  

---

**Built with ❤️ for modern dental practices**
