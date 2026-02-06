# Fix 404 NOT_FOUND Error on Vercel

## Problem
Getting `404: NOT_FOUND` error when deploying to Vercel.

## Solution

### Step 1: Remove vercel.json (If Present)

Next.js projects don't need `vercel.json` - Vercel auto-detects everything. If you have one, it might be causing conflicts.

**Already removed** - The `frontend/vercel.json` has been deleted.

### Step 2: Configure Vercel Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **General**
4. Check these settings:

#### Root Directory
- **Root Directory**: Must be set to `frontend`
- If it's empty or set to `.`, change it to `frontend`
- Click **Edit** → Enter `frontend` → **Save**

#### Framework Preset
- **Framework Preset**: Should be **"Next.js"**
- If it's "Other" or wrong, change it to **"Next.js"**

#### Build and Output Settings
- **Build Command**: `npm run build` (or leave empty for auto)
- **Output Directory**: Leave empty (Next.js uses `.next` automatically)
- **Install Command**: `npm install` (or leave empty for auto)

### Step 3: Verify Project Structure

Make sure your repository structure is:
```
your-repo/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   ├── components/
│   ├── package.json
│   ├── next.config.js
│   └── ...
├── backend/
└── ...
```

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger redeploy

### Step 5: Check Build Logs

1. Go to the failed deployment
2. Click on it to see **Build Logs**
3. Look for errors like:
   - "Cannot find module"
   - "Build failed"
   - "Output directory not found"

## Common Causes and Fixes

### Cause 1: Root Directory Not Set
**Symptom**: Vercel tries to build from root, can't find Next.js

**Fix**: 
- Settings → General → Root Directory → Set to `frontend`

### Cause 2: Wrong Framework Preset
**Symptom**: Vercel uses wrong build settings

**Fix**:
- Settings → General → Framework Preset → Select "Next.js"

### Cause 3: Missing Dependencies
**Symptom**: Build fails with module errors

**Fix**:
- Make sure `frontend/package.json` has all dependencies
- Run `npm install` in frontend directory
- Commit `package-lock.json`

### Cause 4: Build Output in Wrong Location
**Symptom**: 404 after successful build

**Fix**:
- Don't set Output Directory manually
- Let Next.js handle it automatically
- Remove any `outputDirectory` from settings

## Quick Fix Checklist

- [ ] Root Directory set to `frontend` in Vercel settings
- [ ] Framework Preset is "Next.js"
- [ ] No `vercel.json` file in frontend (or root)
- [ ] `frontend/package.json` exists and has `next` dependency
- [ ] `frontend/next.config.js` exists
- [ ] `frontend/app` directory exists with `layout.tsx` and `page.tsx`
- [ ] All dependencies in `package.json`
- [ ] Redeployed after changes

## Alternative: Deploy from Frontend Directory

If the issue persists, try deploying only the frontend:

1. **Create a new repository** with just the frontend code:
   ```bash
   # Create new repo
   mkdir civic-issue-frontend
   cd civic-issue-frontend
   
   # Copy frontend files
   cp -r ../frontend/* .
   
   # Initialize git
   git init
   git add .
   git commit -m "Initial commit"
   
   # Push to new GitHub repo
   git remote add origin <your-new-repo-url>
   git push -u origin main
   ```

2. **Deploy the new repo** to Vercel (it will auto-detect everything)

## Still Not Working?

1. **Check Vercel Build Logs:**
   - Go to deployment → View build logs
   - Look for specific error messages

2. **Test Locally:**
   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```
   - If this works locally, the issue is Vercel configuration
   - If this fails, fix local issues first

3. **Contact Support:**
   - Share build logs
   - Share project structure
   - Share Vercel settings screenshot

## Correct Vercel Settings

```
Root Directory: frontend
Framework Preset: Next.js
Build Command: (empty - auto)
Output Directory: (empty - auto)
Install Command: (empty - auto)
Node Version: (auto or 18.x)
```

---

**Most Common Fix**: Set Root Directory to `frontend` in Vercel project settings!

