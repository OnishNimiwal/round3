# Vercel Deployment - Application Preset Guide

## When Deploying via Vercel Dashboard

### Step 1: Import Your Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository

### Step 2: Configure Project Settings

When configuring your project, you'll see **"Configure Project"** screen:

#### Root Directory
- Click **"Edit"** next to Root Directory
- Set to: `frontend`
- This tells Vercel to deploy from the `frontend` folder

#### Framework Preset
- **Framework Preset**: Select **"Next.js"** (should auto-detect)
- If it doesn't auto-detect:
  - Click the dropdown
  - Select **"Next.js"**
  - Or manually select **"Other"** and it will use `vercel.json`

#### Build and Output Settings
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.next` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### Step 3: Environment Variables

Add these environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

### Step 4: Deploy

Click **Deploy** and wait for the build to complete.

---

## When Deploying via Vercel CLI

### Option 1: Deploy from Frontend Directory (Recommended)

```bash
cd frontend
vercel
```

When prompted:
- **Set up and deploy?** → **Y**
- **Which scope?** → Select your account
- **Link to existing project?** → **N** (first time) or **Y** (subsequent)
- **Project name?** → `civic-issue-frontend`
- **Directory?** → `./` (current directory)
- **Override settings?** → **N**

Vercel will auto-detect Next.js framework.

### Option 2: Deploy from Root Directory

```bash
# From project root
vercel
```

When prompted:
- **Set up and deploy?** → **Y**
- **Which scope?** → Select your account
- **Link to existing project?** → **N**
- **Project name?** → `civic-issue-frontend`
- **Directory?** → `./frontend` ← **Important!**
- **Override settings?** → **N**

---

## Application Preset Options

Vercel supports these presets (auto-detected or manual):

1. **Next.js** ← Your app uses this
2. React
3. Vue
4. Angular
5. Svelte
6. Other

For your project, it should auto-detect **Next.js** because:
- You have `next` in `package.json`
- You have `next.config.js`
- You have `.next` build output

---

## Troubleshooting Preset Detection

### If Vercel doesn't detect Next.js:

1. **Check Root Directory:**
   - Make sure it's set to `frontend` folder
   - Not the root of the repository

2. **Verify Files:**
   - `frontend/package.json` exists
   - `frontend/next.config.js` exists
   - `frontend/vercel.json` exists (optional)

3. **Manual Override:**
   - In Vercel Dashboard → Project Settings → General
   - Under "Framework Preset", select **"Next.js"**
   - Save and redeploy

4. **Use vercel.json:**
   - The `frontend/vercel.json` file explicitly sets framework to "nextjs"
   - This should force Vercel to use Next.js preset

---

## Complete Deployment Checklist

- [ ] Root Directory set to `frontend`
- [ ] Framework Preset: **Next.js** (auto-detected or manual)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `.next`
- [ ] Environment Variable `NEXT_PUBLIC_API_URL` set
- [ ] Deploy successful
- [ ] Test the live application

---

## Quick Command Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory (recommended)
cd frontend
vercel

# Deploy with production flag
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

---

## After Deployment

1. **Get your Vercel URL:**
   - Format: `https://your-project.vercel.app`
   - Or custom domain if configured

2. **Update Backend CORS:**
   - Add your Vercel URL to backend CORS settings
   - Update `FRONTEND_URL` in Railway/Render

3. **Test:**
   - Visit your Vercel URL
   - Test all features
   - Check browser console for errors

---

## Common Issues

### "Framework not detected"
- **Solution**: Manually select "Next.js" in project settings

### "Build failed"
- **Solution**: Check build logs, ensure all dependencies are in `package.json`

### "Environment variables not working"
- **Solution**: Make sure variable name starts with `NEXT_PUBLIC_` for client-side access

### "404 on routes"
- **Solution**: Next.js App Router should work automatically, check `app` directory structure

