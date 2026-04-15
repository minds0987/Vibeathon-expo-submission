# KitchenOS Deployment Checklist

Quick reference for deploying KitchenOS to Vercel with Supabase.

## ✅ Pre-Deployment Checklist

### Option A: Deploy with Mock Data (Fastest - 5 minutes)
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Ready to deploy

**Skip Supabase setup** - the app will automatically use mock data.

### Option B: Deploy with Real Database (Full Setup - 15 minutes)
- [ ] Code pushed to GitHub
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Environment variables configured
- [ ] Vercel account created
- [ ] Ready to deploy

---

## 🚀 Quick Start: Deploy with Mock Data

### 1. Deploy to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `Nivet2006/kiro-vibe-01`
4. Configure project:
   - **Root Directory**: `kitchenos-next`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click **"Deploy"**
6. Wait 2-3 minutes
7. Done! Your app is live with mock data

---

## 🗄️ Full Setup: Deploy with Supabase

### 1. Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Sign in and click **"New Project"**
3. Fill in:
   - Name: `kitchenos`
   - Database password: (create and save it)
   - Region: (closest to you)
4. Click **"Create new project"**
5. Wait ~2 minutes

### 2. Get API Credentials (1 minute)

1. Click **"Project Settings"** (gear icon)
2. Click **"API"**
3. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

### 3. Create Database Tables (3 minutes)

1. Click **"SQL Editor"** in Supabase dashboard
2. Click **"New query"**
3. Copy entire contents of `supabase-schema.sql`
4. Paste and click **"Run"**
5. Verify success message

### 4. Update Local Environment (1 minute)

Edit `kitchenos-next/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Test locally:
```bash
cd kitchenos-next
npm run dev
```

### 5. Deploy to Vercel (5 minutes)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Root Directory**: `kitchenos-next`
   - **Framework Preset**: Next.js
5. Add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
6. Click **"Deploy"**
7. Wait 2-3 minutes
8. Done! Your app is live with real database

---

## 📋 Post-Deployment

### Verify Deployment

- [ ] App loads without errors
- [ ] Kitchen Display shows orders
- [ ] Command Center shows metrics
- [ ] AI Hub shows inventory
- [ ] Staff Dispatch shows tasks

### Optional: Add Sample Data

If using Supabase and want test data:

1. Open Supabase SQL Editor
2. Uncomment the SEED DATA section in `supabase-schema.sql`
3. Run the INSERT statements
4. Refresh your app

### Automatic Deployments

Once connected to Vercel:
- ✅ Every push to `main` branch auto-deploys to production
- ✅ Pull requests get preview URLs
- ✅ Build logs available in Vercel dashboard

---

## 🔧 Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Verify `kitchenos-next` is set as root directory
- Ensure `package.json` has correct scripts

### "Supabase not configured" warning
- Add environment variables in Vercel project settings
- Redeploy after adding variables
- Check variable names match exactly

### App loads but no data
- If using Supabase: Add seed data or create data through UI
- If using mock data: This is expected behavior

### Database connection errors
- Verify Supabase project is running
- Check API credentials are correct
- Verify tables were created successfully

---

## 📚 Additional Resources

- **Supabase Setup Guide**: See `SUPABASE_SETUP.md`
- **Database Schema**: See `supabase-schema.sql`
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

## 🎯 Quick Commands

```bash
# Local development
cd kitchenos-next
npm run dev

# Build locally (test before deploy)
npm run build

# Run tests
npm test

# Deploy via CLI (alternative to dashboard)
npm install -g vercel
vercel
```

---

## ✨ You're All Set!

Your KitchenOS app is now deployed and ready to use. Share your Vercel URL with your team!
