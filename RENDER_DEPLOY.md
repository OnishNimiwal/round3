# Deploy Backend to Render - Complete Guide

## Step-by-Step Deployment to Render

### Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with **GitHub** (recommended) or email
3. Verify your email if needed

### Step 3: Create New Web Service

1. Click **New +** button (top right)
2. Select **Web Service**
3. Connect your GitHub repository:
   - Click **Connect account** if not connected
   - Authorize Render to access your repositories
   - Select your repository: `OnishNimiwal/round3`

### Step 4: Configure Web Service

Fill in these settings:

#### Basic Settings
- **Name**: `civic-issue-backend` (or any name you prefer)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Plan
- Select **Free** plan (or paid if you need more resources)

### Step 5: Add Environment Variables

Click **Add Environment Variable** and add these one by one:

```
PORT=5000
```

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-issues?retryWrites=true&w=majority
```
*(Replace with your MongoDB Atlas connection string)*

```
JWT_SECRET=your-very-strong-random-secret-key-here
```
*(Generate a strong random string - use online generator or `openssl rand -base64 32`)*

```
GEMINI_API_KEY=your-gemini-api-key
```
*(Get from [Google AI Studio](https://makersuite.google.com/app/apikey))*

```
OPENAI_API_KEY=your-openai-api-key
```
*(Optional - for chatbot, can leave empty if not using)*

```
NODE_ENV=production
```

```
FRONTEND_URL=https://your-frontend.vercel.app
```
*(Your Vercel frontend URL)*

### Step 6: Create MongoDB Atlas Database (If Not Done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account (if needed)
3. Create a new cluster (free tier)
4. Click **Connect** → **Connect your application**
5. Copy connection string
6. Replace `<password>` with your database password
7. Add Render IP to whitelist:
   - Network Access → Add IP Address
   - Use `0.0.0.0/0` for all IPs (or get Render's IP range)

### Step 7: Deploy

1. Scroll down and click **Create Web Service**
2. Render will start building and deploying
3. Wait for deployment to complete (2-5 minutes)
4. You'll see a URL like: `https://civic-issue-backend.onrender.com`

### Step 8: Update Frontend Environment Variable

1. Go to your **Vercel Dashboard**
2. Your project → **Settings** → **Environment Variables**
3. Update `NEXT_PUBLIC_API_URL` to:
   ```
   https://your-backend-name.onrender.com/api
   ```
   *(Replace with your actual Render URL)*
4. Redeploy frontend

### Step 9: Test Your Deployment

1. Visit your Render service URL
2. Test API endpoint: `https://your-backend.onrender.com/api/issues`
3. Test from frontend - submit an issue
4. Check Render logs for any errors

---

## Render Configuration Summary

| Setting | Value |
|---------|-------|
| **Name** | `civic-issue-backend` |
| **Region** | Choose closest region |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

---

## Important Notes

### Root Directory
⚠️ **CRITICAL**: Set Root Directory to `backend` in Render settings!
- This tells Render where your Node.js app is located
- Without this, Render won't find your `package.json` and `server.js`

### Free Tier Limitations
- **Spins down after 15 minutes** of inactivity
- **First request** after spin-down takes ~30 seconds (cold start)
- **512 MB RAM** limit
- **0.1 CPU** limit

### File Uploads
- Render's file system is **ephemeral** (files are lost on redeploy)
- For production, consider:
  - **Cloudinary** (recommended)
  - **AWS S3**
  - **Google Cloud Storage**

### Environment Variables
- All sensitive data should be in environment variables
- Never commit `.env` files to Git
- Use Render's Environment Variables section

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Check Root Directory is set to `backend`
- Verify `package.json` exists in `backend/` folder
- Check build logs for specific missing package

**Error: "npm install failed"**
- Check Node version compatibility
- Verify all dependencies in `package.json`
- Check build logs for specific error

### Service Won't Start

**Error: "Port already in use"**
- Render automatically sets PORT - don't hardcode it
- Use `process.env.PORT || 5000` in your code (already done)

**Error: "MongoDB connection failed"**
- Verify `MONGODB_URI` environment variable is set
- Check MongoDB Atlas IP whitelist includes Render
- Verify connection string format

### 404 Errors

**API endpoints return 404**
- Check that routes are properly set up
- Verify API path: `/api/issues`, `/api/admin`, etc.
- Check Render logs for routing errors

### Slow Response Times

**First request is slow**
- Normal on free tier (cold start ~30 seconds)
- Service spins down after 15 min inactivity
- Consider paid plan for always-on service

---

## Render Dashboard Features

### Logs
- View real-time logs: **Logs** tab
- Useful for debugging
- Shows build and runtime logs

### Metrics
- Monitor CPU, Memory, Request count
- Available on paid plans

### Manual Deploy
- **Manual Deploy** button to redeploy
- Useful for testing changes

### Environment Variables
- Add/update variables anytime
- Changes require redeploy
- Secure storage

---

## Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Update frontend `NEXT_PUBLIC_API_URL`
3. ✅ Test issue submission from frontend
4. ✅ Test admin login
5. ✅ Monitor logs for errors
6. ✅ Set up custom domain (optional)
7. ✅ Consider upgrading to paid plan for production

---

## Quick Checklist

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web Service created
- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] All environment variables added
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string added
- [ ] Service deployed successfully
- [ ] Frontend `NEXT_PUBLIC_API_URL` updated
- [ ] Tested API endpoints
- [ ] Tested from frontend

---

## Support

If you encounter issues:
1. Check **Render Logs** for error messages
2. Verify all environment variables are set
3. Check MongoDB connection
4. Review this guide for common issues

**Your backend should now be live on Render!** 🚀

