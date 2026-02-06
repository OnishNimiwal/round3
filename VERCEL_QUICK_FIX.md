# Quick Fix for 404 Error on Vercel

## ⚡ Immediate Fix (2 minutes)

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project

### Step 2: Fix Root Directory
1. Click **Settings** (top right)
2. Click **General** (left sidebar)
3. Scroll to **Root Directory**
4. Click **Edit**
5. Enter: `frontend`
6. Click **Save**

### Step 3: Verify Framework
1. Still in **General** settings
2. Check **Framework Preset**
3. Should say **"Next.js"**
4. If not, select **"Next.js"** from dropdown

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for build to complete

## ✅ That's It!

Your app should now work. The 404 error was because Vercel was looking in the wrong directory.

## Still Getting 404?

### Check Build Logs:
1. Click on the deployment
2. Check **Build Logs** tab
3. Look for errors

### Common Issues:

**"Cannot find module"**
→ Dependencies missing. Make sure `frontend/package.json` has all packages.

**"Build failed"**
→ Check the error message in build logs.

**"Output directory not found"**
→ Don't set Output Directory manually. Leave it empty.

## Correct Settings Summary

```
✅ Root Directory: frontend
✅ Framework Preset: Next.js
✅ Build Command: (empty - auto)
✅ Output Directory: (empty - auto)
✅ Install Command: (empty - auto)
```

---

**99% of 404 errors are fixed by setting Root Directory to `frontend`!**

