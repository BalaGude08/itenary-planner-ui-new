# 🚀 Step-by-Step Vercel Deployment Guide

## Prerequisites Checklist

- [ ] Your code is pushed to GitHub (if not, we'll cover that too)
- [ ] You have a GitHub account
- [ ] You have a Vercel account (or we'll create one)

---

## Step 1: Push Your Code to GitHub

### If your code is NOT on GitHub yet:

1. **Create a new GitHub repository:**
   - Go to https://github.com/new
   - Name it: `itenary-planner-ui-new` (or any name you prefer)
   - Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license
   - Click **"Create repository"**

2. **Push your code from terminal:**
   ```bash
   # If you haven't initialized git yet
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Ready for Vercel deployment"
   
   # Add your GitHub repo (replace YOUR_USERNAME and YOUR_REPO_NAME)
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### If your code IS already on GitHub:
   ✅ Skip to Step 2

---

## Step 2: Sign Up/Login to Vercel

1. **Go to Vercel:**
   - Visit: https://vercel.com
   
2. **Sign up or Login:**
   - Click **"Sign Up"** (if new) or **"Log In"** (if existing)
   - Choose **"Continue with GitHub"** (recommended)
   - Authorize Vercel to access your GitHub account
   - Click **"Authorize"** when prompted

---

## Step 3: Create New Project

1. **After logging in, you'll see your dashboard**
   - Click the **"Add New..."** button (top right)
   - Or click **"New Project"** button

2. **Import Repository:**
   - You'll see a list of your GitHub repositories
   - **Search for** or **find** your `itenary-planner-ui-new` repository
   - Click **"Import"** next to your repository

---

## Step 4: Configure Project Settings

### Project Settings Screen:

1. **Project Name:**
   - Default will be your repo name
   - You can change it if you want (e.g., `itinerary-planner`)

2. **Framework Preset:**
   - Vercel should **auto-detect** "Vite"
   - If not, select **"Vite"** from the dropdown

3. **Root Directory:**
   - Leave as **`.`** (root) - this is correct

4. **Build Command:**
   - Should be: `npm run build`
   - Vercel auto-detects this ✅

5. **Output Directory:**
   - Should be: `dist`
   - Vercel auto-detects this ✅

6. **Install Command:**
   - Should be: `npm install`
   - Leave as default ✅

---

## Step 5: Set Environment Variables (IMPORTANT)

Click **"Environment Variables"** section to expand it:

### Add these variables:

1. **Click "Add" button**

2. **Variable 1:**
   - **Key:** `VITE_API_BASE`
   - **Value:** Your backend API URL (e.g., `https://your-api.com/api` or `http://localhost:3000/api` if testing)
   - **Environments:** Select all (Production, Preview, Development) ✅
   - Click **"Add"**

3. **Variable 2:**
   - **Key:** `VITE_FLAG_USE_MOCKS`
   - **Value:** `true` (for mock data) or `false` (for real API)
   - **Environments:** Select all ✅
   - Click **"Add"**

4. **Variable 3 (Optional - for Firebase):**
   - If you've configured Firebase, add these:
   - `VITE_FIREBASE_API_KEY` - Your Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
   - (Add other Firebase config vars if needed)

**Note:** You can add/update these later in Project Settings → Environment Variables

---

## Step 6: Deploy!

1. **Click the big blue "Deploy" button** at the bottom

2. **Wait for deployment:**
   - Vercel will:
     - Install dependencies (`npm install`)
     - Build your app (`npm run build`)
     - Deploy to production
   - This takes **1-3 minutes** ⏱️

3. **Watch the logs:**
   - You'll see real-time build logs
   - Wait until you see **"Deployment successful"** ✅

---

## Step 7: Access Your Live App

1. **After successful deployment:**
   - You'll see a **"Visit"** button or a URL
   - Click it or copy the URL
   - Format: `your-app-name.vercel.app`

2. **Your app is now live!** 🎉

---

## Step 8: Custom Domain (Optional)

If you want a custom domain:

1. Go to your project in Vercel dashboard
2. Click **"Settings"** tab
3. Click **"Domains"** in the sidebar
4. Enter your domain name
5. Follow DNS configuration instructions

---

## Troubleshooting

### Build Fails?

**Check these:**
- ✅ All dependencies are in `package.json`
- ✅ Build command is `npm run build`
- ✅ Output directory is `dist`
- ✅ No TypeScript errors (check locally first)

### Firebase Not Working?

**Make sure:**
- ✅ Added Firebase config as environment variables
- ✅ Updated `src/lib/firebase.ts` to use environment variables
- ✅ Firebase project has correct authorized domains

### 404 Errors on Routes?

- ✅ Your `vercel.json` is configured (already done!)
- ✅ Should work automatically

---

## Quick Commands Reference

### Via Vercel CLI (Alternative Method):

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from your project directory)
vercel

# Deploy to production
vercel --prod
```

---

## Next Steps After Deployment

1. **Test your app:**
   - Visit the live URL
   - Test all features
   - Test login functionality (if Firebase is configured)

2. **Set up auto-deployment:**
   - Every push to `main` branch auto-deploys ✅
   - Already enabled by default!

3. **Preview deployments:**
   - Every pull request gets a preview URL
   - Test before merging

4. **Monitor:**
   - Check Vercel dashboard for analytics
   - Monitor build logs for errors

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check build logs in Vercel dashboard if deployment fails

---

**You're all set! 🚀 Happy deploying!**

