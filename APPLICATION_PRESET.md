# Application Preset for Vercel

## What is Application Preset?

The **Application Preset** (or Framework Preset) tells Vercel which framework your project uses so it can:
- Use the correct build settings
- Optimize the deployment
- Configure routing correctly

## For Your Project

**Your Application Preset: Next.js**

Vercel should **auto-detect** this because:
- ✅ You have `next` in `package.json`
- ✅ You have `next.config.js` file
- ✅ You're using Next.js 14 with App Router

## How to Set It

### Method 1: Auto-Detection (Recommended)
Vercel will automatically detect Next.js when you:
1. Set **Root Directory** to `frontend`
2. Deploy the project

### Method 2: Manual Selection (If Auto-Detection Fails)

**Via Vercel Dashboard:**
1. Go to your project → **Settings** → **General**
2. Scroll to **"Framework Preset"**
3. Select **"Next.js"** from dropdown
4. Save and redeploy

**Via vercel.json:**
The `frontend/vercel.json` file already specifies:
```json
{
  "framework": "nextjs"
}
```
This forces Vercel to use Next.js preset.

## Configuration Summary

| Setting | Value |
|--------|-------|
| **Root Directory** | `frontend` |
| **Framework Preset** | `Next.js` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

## Verification

After deployment, check:
1. ✅ Build completes successfully
2. ✅ No framework warnings in logs
3. ✅ Application loads correctly
4. ✅ Routes work (App Router)

## If Preset is Wrong

If Vercel detects the wrong framework:

1. **Check Root Directory:**
   - Must be `frontend` (not root)
   - Must contain `package.json` with `next` dependency

2. **Verify Files:**
   ```bash
   frontend/
   ├── package.json      # Must have "next" dependency
   ├── next.config.js    # Next.js config
   ├── app/              # App Router directory
   └── vercel.json       # Framework preset override
   ```

3. **Manual Override:**
   - Use `vercel.json` with `"framework": "nextjs"`
   - Or select manually in Vercel dashboard

## Quick Reference

```bash
# Deploy with auto-detection
cd frontend
vercel

# Framework will be auto-detected as Next.js
```

---

**Your project is already configured correctly!** The `frontend/vercel.json` file ensures Vercel uses the Next.js preset.

