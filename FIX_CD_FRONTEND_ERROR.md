# Fix "cd: frontend: No such file or directory" Error

## The Problem

You're getting this error:
```
sh: line 1: cd: frontend: No such file or directory
Error: Command "cd frontend && npm install" exited with 1
```

## Why This Happens

You have **two conflicting settings**:

1. **Root Directory** is set to `frontend` in Vercel settings
2. **Build/Install Commands** are trying to `cd frontend`

When Root Directory is `frontend`, Vercel **already changes into that directory** before running commands. So `cd frontend` fails because you're already there!

## Solution: Choose One Approach

### Option 1: Root Directory = `frontend` (Recommended)

**In Vercel Dashboard:**
1. Settings → General → Root Directory = `frontend` ✅

**In Build Settings:**
- Build Command: `npm run build` (remove `cd frontend &&`)
- Output Directory: `.next` (remove `frontend/`)
- Install Command: `npm install` (remove `cd frontend &&`)

**I've already updated `vercel.json` with these settings!**

Just commit and push:
```bash
git add vercel.json
git commit -m "Fix vercel.json for frontend root directory"
git push
```

### Option 2: Root Directory = `.` (root)

**In Vercel Dashboard:**
1. Settings → General → Root Directory = `.` (or leave empty)

**In Build Settings:**
- Build Command: `cd frontend && npm run build`
- Output Directory: `frontend/.next`
- Install Command: `cd frontend && npm install`

## Quick Fix (Right Now)

1. **Go to Vercel Dashboard** → Your Project → Settings → General
2. **Check Root Directory:**
   - If it's `frontend`: Update Build Settings to remove `cd frontend &&`
   - If it's `.` or empty: Keep `cd frontend &&` in commands

3. **I've updated `vercel.json`** to work with Root Directory = `frontend`
   - Just commit and push it!

## Updated vercel.json

The new `vercel.json` assumes Root Directory is set to `frontend`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

This works because when Root Directory = `frontend`, Vercel:
1. Changes into `frontend/` directory
2. Runs `npm install` (already in frontend, no need to cd)
3. Runs `npm run build` (already in frontend)
4. Looks for output in `.next` (relative to frontend directory)

## Verification

After fixing, your build should show:
```
✓ Running "install" command: npm install
✓ Installing dependencies
✓ Building Next.js app
✓ Build completed
```

## Summary

**The issue:** Root Directory and Build Commands are conflicting.

**The fix:** 
- Set Root Directory to `frontend` ✅
- Remove `cd frontend &&` from all commands ✅
- Use relative paths (`.next` instead of `frontend/.next`) ✅

**Already done in `vercel.json` - just commit and push!**

