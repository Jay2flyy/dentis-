# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Free tier perfect for dental practices
- Automatic HTTPS
- Global CDN
- Zero configuration
- Best for React/Vite apps

**Steps:**

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Connect GitHub
- Select your repository
- Click "Deploy"

3. **Add Environment Variables**
- Go to Project Settings → Environment Variables
- Add:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Click "Save"
- Redeploy

4. **Done!** 🎉
Your site is live at `your-project.vercel.app`

### Option 2: Netlify

**Steps:**

1. **Build the project**
```bash
npm run build
```

2. **Deploy**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

3. **Add Environment Variables**
- Go to Site Settings → Environment Variables
- Add your Supabase credentials
- Rebuild the site

### Option 3: Custom VPS (Advanced)

For self-hosting on DigitalOcean, AWS, etc.

**Requirements:**
- Ubuntu 22.04 server
- Node.js 18+
- Nginx
- SSL certificate

**Setup:**

1. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install Nginx**
```bash
sudo apt update
sudo apt install nginx
```

3. **Deploy App**
```bash
git clone YOUR_REPO
cd dental-practice-automation
npm install
npm run build
```

4. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/dental-practice-automation/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

5. **SSL with Certbot**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Custom Domain Setup

### Using Vercel

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `smilecare.dental`)
4. Follow DNS instructions:
   - Add A record: `76.76.21.21`
   - Or CNAME: `cname.vercel-dns.com`
5. Wait 24-48 hours for propagation

### Using Netlify

1. Go to Domain Settings
2. Click "Add custom domain"
3. Update DNS records as instructed
4. SSL automatically provisioned

## Environment Variables

### Required
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Optional
```env
# AI Chatbot (OpenAI or Groq)
VITE_AI_API_KEY=sk-...
VITE_AI_API_URL=https://api.openai.com/v1/chat/completions

# Email Service (Resend, SendGrid, etc.)
VITE_EMAIL_SERVICE_URL=https://api.resend.com/emails

# Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## Pre-Deployment Checklist

### Code Changes
- [ ] Update practice name and info in Footer.tsx
- [ ] Update phone numbers throughout
- [ ] Update email addresses
- [ ] Change office hours
- [ ] Update address and map location
- [ ] Add your logo (replace placeholder)
- [ ] Update services and pricing
- [ ] Add team member photos
- [ ] Customize color scheme in tailwind.config.js

### Database
- [ ] Supabase project created
- [ ] Schema migrated successfully
- [ ] Admin user created
- [ ] Test appointment created and visible
- [ ] RLS policies verified

### Testing
- [ ] Test booking flow end-to-end
- [ ] Test admin login
- [ ] Test appointment status changes
- [ ] Test contact form
- [ ] Test chatbot
- [ ] Test on mobile device
- [ ] Test on different browsers
- [ ] Check all links work
- [ ] Verify forms validate properly

### Content
- [ ] All placeholder text replaced
- [ ] Images optimized (< 200KB each)
- [ ] Meta descriptions added
- [ ] Favicon added
- [ ] Privacy policy page created
- [ ] Terms of service page created

### Performance
- [ ] Build completes without errors
- [ ] No console errors in production
- [ ] Lighthouse score > 90
- [ ] Images lazy loading
- [ ] Proper caching headers

### SEO
- [ ] Unique title tags on each page
- [ ] Meta descriptions
- [ ] Open Graph tags
- [ ] Robots.txt
- [ ] Sitemap.xml
- [ ] Google Search Console setup
- [ ] Google Business Profile claimed

### Security
- [ ] Environment variables not in code
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] RLS policies tested
- [ ] Admin routes protected
- [ ] No sensitive data in client-side code

## Post-Deployment

### Immediate Tasks (Day 1)

1. **Test Everything**
   - Book a test appointment
   - Login to admin
   - Verify emails arrive
   - Check mobile experience

2. **Setup Analytics**
   - Add Google Analytics
   - Setup Google Tag Manager
   - Add Facebook Pixel (if using ads)
   - Install Hotjar for heatmaps

3. **Monitor Errors**
   - Setup Sentry or LogRocket
   - Check error logs
   - Monitor API calls

### Week 1 Tasks

1. **SEO Setup**
   - Submit sitemap to Google
   - Setup Google My Business
   - Add to local directories
   - Create social media profiles

2. **Marketing**
   - Share on social media
   - Email existing patients
   - Update business cards
   - Add to email signatures

3. **Optimization**
   - Monitor booking conversion
   - A/B test CTAs
   - Optimize load times
   - Review user behavior

### Month 1 Tasks

1. **Content**
   - Start blog for SEO
   - Add FAQ page
   - Create patient education content
   - Add video testimonials

2. **Features**
   - Add email notifications
   - Setup SMS reminders
   - Integrate payment system
   - Add online forms

3. **Growth**
   - Google Ads campaign
   - Facebook Ads
   - Local SEO optimization
   - Review generation system

## Monitoring & Maintenance

### Weekly
- Check appointment bookings
- Review contact form submissions
- Monitor website uptime
- Check error logs
- Review analytics

### Monthly
- Database backup verification
- Update dependencies (`npm update`)
- Review and optimize performance
- Analyze conversion rates
- Update content/blog

### Quarterly
- Security audit
- Dependency updates
- Feature enhancements
- User feedback review
- Competitor analysis

## Troubleshooting

### Site Not Loading
1. Check Vercel/Netlify dashboard
2. Verify DNS settings
3. Check build logs
4. Clear browser cache

### Bookings Not Saving
1. Check Supabase connection
2. Verify environment variables
3. Check RLS policies
4. Review browser console

### Admin Can't Login
1. Verify user exists in auth.users
2. Check admin_users table entry
3. Verify email/password
4. Check RLS policies

### Slow Performance
1. Enable caching
2. Optimize images
3. Use CDN
4. Minimize JavaScript
5. Enable compression

## Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **React Docs**: [react.dev](https://react.dev)

## Scaling

### When You Outgrow Free Tier

**Vercel**: Upgrade to Pro ($20/month)
- More bandwidth
- Better analytics
- Priority support

**Supabase**: Upgrade to Pro ($25/month)
- More database space
- No pause on inactivity
- Better performance
- Daily backups

### When to Upgrade

- 1,000+ patients
- 100+ bookings/month
- Need advanced analytics
- Want priority support
- Need better performance

---

**Your dental practice website is ready to go live! 🚀**
