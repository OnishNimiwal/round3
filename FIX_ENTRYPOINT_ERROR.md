# Fix "No entrypoint found" Error on Vercel

## Error Message
```
Error: No entrypoint found. Searched for:
- app.{js,cjs,mjs,ts,cts,mts}
- index.{js,cjs,mjs,ts,cts,mts}
- server.{js,cjs,mjs,ts,cts,mts}
```

## Problem
Vercel is trying to build from the **root directory** instead of the `frontend` folder, so it can't find the Next.js entry point.

## Solution 1: Set Root Directory in Vercel (Recommended)

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project

### Step 2: Set Root Directory
1. Click **Settings** → **General**
2. Find **Root Directory**
3. Click **Edit**
4. Enter: `frontend`
5. Click **Save**

### Step 3: Clear Build Settings
1. Still in **General** settings
2. Scroll to **Build & Development Settings**
3. **Build Command**: Leave empty (or set to `npm run build`)
4. **Output Directory**: Leave empty (Next.js uses `.next` automatically)
5. **Install Command**: Leave empty (or set to `npm install`)

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment
3. Wait for build

## Solution 2: Use vercel.json (Alternative)

I've created a `vercel.json` in the root directory that tells Vercel to build from the `frontend` folder.

**The file is already created** - just redeploy!

## Solution 3: Deploy from Frontend Directory Only

If the above doesn't work:

1. **Create a separate branch or repo** with just frontend:
   ```bash
   # Option A: Create new branch
   git checkout -b frontend-only
   git rm -r backend
   git commit -m "Frontend only for Vercel"
   git push origin frontend-only
   
   # Deploy this branch to Vercel
   ```

2. **Or create a new repository:**
   ```bash
   mkdir civic-frontend
   cd civic-frontend
   cp -r ../frontend/* .
   git init
   git add .
   git commit -m "Initial"
   git remote add origin <new-repo-url>
   git push -u origin main
   ```

## Verification

After fixing, your build logs should show:
```
✓ Installing dependencies
✓ Building Next.js app
✓ Build completed
```

Instead of:
```
✗ Error: No entrypoint found
```

## Quick Checklist

- [ ] Root Directory set to `frontend` in Vercel settings
- [ ] OR `vercel.json` exists in root (already created)
- [ ] Framework Preset is "Next.js"
- [ ] Build Command is empty or `npm run build`
- [ ] Output Directory is empty
- [ ] Redeployed after changes

## Most Common Fix

**99% of the time, setting Root Directory to `frontend` fixes this!**

1. Vercel Dashboard → Settings → General
2. Root Directory → Edit → `frontend` → Save
3. Redeploy

---

**The `vercel.json` file I created should also work as a backup solution.**

