# KitchenOS - Deployment Guide

## 🚀 Vercel Deployment Fix

This guide resolves the deployment error:
```
Environment Variable "NEXT_PUBLIC_SUPABASE_URL" references Secret "supabase-url", which does not exist.
```

---

## ✅ Quick Fix (Recommended)

### Step 1: Set Environment Variables in Vercel Dashboard

1. **Go to your Vercel project**:
   - Visit https://vercel.com/dashboard
   - Select your KitchenOS project

2. **Navigate to Settings → Environment Variables**

3. **Add the following variables** (for Production, Preview, and Development):

   ```
   NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project-id.supabase.co
   ```

   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: your-anon-key-here
   ```

   **Important**: 
   - Do NOT use "Secret" type for `NEXT_PUBLIC_*` variables
   - Use "Plain Text" type
   - These are embedded in the client bundle at build time
   - Apply to all environments: Production, Preview, Development

4. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on the latest deployment
   - Select "Redeploy"

---

## 📋 Getting Your Supabase Credentials

### Option 1: From Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Option 2: From Your Local .env.local

If you already have the project running locally:

```bash
cat .env.local
```

Copy the values from there.

---

## 🔧 What Was Fixed

### Before (Broken)
`vercel.json` had secret references:
```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

This caused the error because:
- Secrets `@supabase-url` and `@supabase-anon-key` were never created
- `NEXT_PUBLIC_*` variables can't use secret references (they're inlined at build time)

### After (Fixed)
`vercel.json` now only contains build configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

Environment variables are set directly in the Vercel dashboard as plain text.

---

## 🔐 Security Note

**Why are `NEXT_PUBLIC_*` variables not secrets?**

- `NEXT_PUBLIC_*` variables are **embedded in the client-side JavaScript bundle**
- They are visible to anyone who inspects your website's source code
- This is by design in Next.js for client-side configuration
- The `anon` key is safe to expose (it's protected by Row Level Security in Supabase)

**For server-side secrets** (if you add them later):
- Use variables WITHOUT the `NEXT_PUBLIC_` prefix
- These can be Vercel secrets
- Example: `SUPABASE_SERVICE_ROLE_KEY` (server-only)

---

## 🧪 Verify Deployment

After redeploying, verify the environment variables are working:

1. **Check build logs**:
   - Go to Deployments → Latest deployment
   - Check for any environment variable errors
   - Build should complete successfully

2. **Test the deployed app**:
   - Visit your production URL
   - Open browser DevTools → Console
   - Check for Supabase connection errors
   - Try creating an order or viewing inventory

3. **Check environment variables are loaded**:
   ```javascript
   // In browser console
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   // Should show your Supabase URL
   ```

---

## 🚨 Troubleshooting

### Error: "supabaseUrl is required"

**Cause**: Environment variables not set in Vercel dashboard

**Fix**: 
1. Go to Vercel Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

### Error: "Invalid API key"

**Cause**: Wrong anon key or expired key

**Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Copy the current anon key
3. Update in Vercel dashboard
4. Redeploy

### Build succeeds but app shows "Offline Mode"

**Cause**: Environment variables not applied to the correct environment

**Fix**:
1. In Vercel dashboard, ensure variables are checked for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
2. Redeploy

### Still getting secret reference error

**Cause**: Old deployment cache

**Fix**:
1. Delete `.vercel` folder locally (if exists)
2. In Vercel dashboard, go to Settings → General
3. Scroll to "Delete Project" section
4. Click "Redeploy" instead
5. Or create a new deployment from scratch

---

## 📦 Alternative: Deploy Without Supabase

If you want to deploy quickly without setting up Supabase:

1. **Don't set any environment variables**
2. The app will automatically use **mock data mode**
3. All features work with sample data
4. Perfect for demos and testing

The app detects missing Supabase config and falls back to offline mode automatically.

---

## 🔄 CI/CD Integration

If you're using GitHub integration:

1. **Push the updated `vercel.json`** (already done)
2. **Set environment variables in Vercel dashboard** (one-time setup)
3. **Every push to main** will auto-deploy with the correct config

```bash
git add vercel.json
git commit -m "fix: remove secret references from vercel.json"
git push origin main
```

---

## 📝 Environment Variable Checklist

Before deploying, ensure:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set in Vercel dashboard
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel dashboard
- [ ] Both variables applied to Production, Preview, Development
- [ ] Both variables are "Plain Text" type (not Secret)
- [ ] `vercel.json` does NOT contain `env` block with secret references
- [ ] Supabase project is active and accessible
- [ ] Database schema is deployed (run migration SQL)

---

## 🎯 Next Steps After Deployment

1. **Set up Supabase database**:
   - Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
   - Or follow `SUPABASE_SETUP.md`

2. **Test all features**:
   - Kitchen Display System
   - Command Center
   - AI Hub
   - Staff Dispatch

3. **Monitor logs**:
   - Vercel dashboard → Deployments → Functions
   - Check for any runtime errors

4. **Set up custom domain** (optional):
   - Vercel Settings → Domains
   - Add your custom domain

---

## 📞 Support

If you still encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Supabase project is active
4. Review this guide again
5. Check GitHub issues

---

**Last Updated**: April 15, 2026  
**Status**: Deployment Ready ✅
