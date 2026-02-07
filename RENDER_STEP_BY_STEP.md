# Render Deployment - Step by Step with Screenshots Guide

## 🎯 Complete Walkthrough

### Step 1: Sign Up / Login to Render

1. Go to **https://render.com**
2. Click **Get Started for Free**
3. Sign up with **GitHub** (recommended - easier to connect repos)
4. Authorize Render to access your GitHub

---

### Step 2: Create New Web Service

1. After logging in, you'll see the **Dashboard**
2. Click the **New +** button (top right, blue button)
3. Select **Web Service** from the dropdown

---

### Step 3: Connect Your Repository

1. You'll see "Create a new Web Service" page
2. Under **Connect a repository**, click **Connect account** (if not connected)
3. Authorize Render to access your GitHub repositories
4. Search for your repository: `round3` or `OnishNimiwal/round3`
5. Click on your repository to select it

---

### Step 4: Configure the Service

Fill in these **exact** settings:

#### Basic Information
- **Name**: `civic-issue-backend`
  - (This will be part of your URL: `civic-issue-backend.onrender.com`)

- **Region**: Choose closest to you
  - Examples: `Oregon (US West)`, `Frankfurt (EU)`, `Singapore (Asia)`

- **Branch**: `main`
  - (Or `master` if that's your default branch)

#### Build & Deploy

⚠️ **CRITICAL SETTINGS:**

- **Root Directory**: `backend` ⚠️ **MUST SET THIS!**
  - Click the field and type: `backend`
  - This tells Render where your Node.js app is

- **Runtime**: `Node`
  - Should auto-detect, but verify it says "Node"

- **Build Command**: `npm install`
  - This installs all dependencies

- **Start Command**: `npm start`
  - This runs `node server.js` (from package.json)

#### Plan
- Select **Free** (or upgrade later if needed)

---

### Step 5: Add Environment Variables

**Before clicking "Create Web Service"**, scroll down to **Environment Variables** section.

Click **Add Environment Variable** for each of these:

#### 1. PORT
```
Key: PORT
Value: 5000
```

#### 2. MONGODB_URI
```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/civic-issues?retryWrites=true&w=majority
```
*(Replace with your actual MongoDB Atlas connection string)*

#### 3. JWT_SECRET
```
Key: JWT_SECRET
Value: [generate a random string - at least 32 characters]
```
**To generate:**
- Use: https://randomkeygen.com/
- Or run: `openssl rand -base64 32`
- Copy a long random string

#### 4. GEMINI_API_KEY
```
Key: GEMINI_API_KEY
Value: [your Gemini API key from Google AI Studio]
```
Get from: https://makersuite.google.com/app/apikey

#### 5. NODE_ENV
```
Key: NODE_ENV
Value: production
```

#### 6. FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://your-frontend-app.vercel.app
```
*(Your Vercel frontend URL - update after you know it)*

#### 7. OPENAI_API_KEY (Optional)
```
Key: OPENAI_API_KEY
Value: [your OpenAI key if using chatbot]
```
*(Can leave empty if not using OpenAI)*

---

### Step 6: Create and Deploy

1. Scroll to bottom
2. Click **Create Web Service** (blue button)
3. Render will start building:
   - Installing dependencies
   - Building your app
   - Starting the service
4. Wait 2-5 minutes
5. You'll see **"Live"** status when ready

---

### Step 7: Get Your Backend URL

1. Once deployed, you'll see your service URL at the top
2. Format: `https://civic-issue-backend.onrender.com`
3. **Copy this URL** - you'll need it for frontend

---

### Step 8: Test Your Backend

1. Visit your Render URL in browser
2. You might see an error (normal - no route for `/`)
3. Test API: `https://your-backend.onrender.com/api/issues`
4. Should return JSON (might be empty array or error, but should respond)

---

### Step 9: Update Frontend

1. Go to **Vercel Dashboard**
2. Your project → **Settings** → **Environment Variables**
3. Find `NEXT_PUBLIC_API_URL`
4. Update value to: `https://your-backend.onrender.com/api`
   - *(Replace with your actual Render URL)*
5. **Save**
6. Go to **Deployments** → **Redeploy** (or it auto-redeploys)

---

### Step 10: Test Everything

1. Visit your Vercel frontend URL
2. Try submitting an issue
3. Check Render logs if errors occur
4. Test admin login

---

## ✅ Success Checklist

- [ ] Render account created
- [ ] Web Service created
- [ ] Root Directory set to `backend` ⚠️
- [ ] All environment variables added
- [ ] Service deployed and "Live"
- [ ] Backend URL copied
- [ ] Frontend `NEXT_PUBLIC_API_URL` updated
- [ ] Tested API endpoints
- [ ] Tested from frontend

---

## 🐛 Common Issues

### "Build failed" or "Cannot find module"
- **Fix**: Check Root Directory is set to `backend`
- **Fix**: Verify `package.json` exists in `backend/` folder

### "Service won't start"
- **Fix**: Check Start Command is `npm start`
- **Fix**: Verify `server.js` exists in `backend/` folder
- **Fix**: Check logs for specific error

### "MongoDB connection failed"
- **Fix**: Verify `MONGODB_URI` environment variable
- **Fix**: Check MongoDB Atlas IP whitelist (add `0.0.0.0/0`)
- **Fix**: Verify connection string format

### "CORS errors"
- **Fix**: Add `FRONTEND_URL` environment variable
- **Fix**: Update CORS settings in `server.js` (already done)

---

## 📝 Important Notes

### Free Tier Limitations
- ⏱️ **Spins down after 15 minutes** of inactivity
- 🐌 **First request** after spin-down takes ~30 seconds (cold start)
- 💾 **512 MB RAM** limit
- ⚡ **0.1 CPU** limit

### File Uploads
- Files uploaded to Render are **temporary**
- They'll be lost on redeploy
- For production, use **Cloudinary** or **AWS S3**

### Environment Variables
- All sensitive data in environment variables
- Never commit `.env` files
- Update variables anytime in Render dashboard

---

## 🎉 You're Done!

Your backend is now live on Render! 

**Next Steps:**
1. Monitor logs for any issues
2. Test all features
3. Consider upgrading to paid plan for production (always-on service)

---

**Need help?** Check the logs in Render dashboard for specific error messages!

