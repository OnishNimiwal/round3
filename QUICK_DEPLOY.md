# Quick Deploy Guide - Vercel

## 🚀 Fastest Way to Deploy

### Step 1: Deploy Frontend to Vercel (5 minutes)

**Option A: Via Vercel Dashboard (Easier)**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. **Configure Project:**
   - **Root Directory**: Set to `frontend` (click Edit)
   - **Framework Preset**: Select **"Next.js"** (should auto-detect)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.railway.app/api`
6. Click **Deploy**

**Option B: Via Vercel CLI**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```
   
   When prompted:
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - Project name? **civic-issue-frontend**
   - Directory? **./** (current directory)
   - Override settings? **N**
   
   **Note**: Vercel will auto-detect Next.js framework preset.

4. **Set Environment Variable:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to **Settings** → **Environment Variables**
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.railway.app/api`
   - (You'll get this URL after deploying backend)

### Step 2: Deploy Backend to Railway (10 minutes)

1. **Sign up at [Railway](https://railway.app)** (use GitHub)

2. **Create New Project:**
   - Click **New Project**
   - Select **Deploy from GitHub repo**
   - Connect your repository

3. **Configure:**
   - Railway auto-detects Node.js
   - Set **Root Directory** to `backend`
   - Click **Deploy**

4. **Add Environment Variables:**
   - Go to **Variables** tab
   - Add these variables:
   
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-issues
   JWT_SECRET=your-random-secret-key-here
   GEMINI_API_KEY=your-gemini-key
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

5. **Get Your Backend URL:**
   - Railway gives you a URL like: `https://your-app.railway.app`
   - Copy this URL

6. **Update Frontend Environment Variable:**
   - Go back to Vercel
   - Update `NEXT_PUBLIC_API_URL` to: `https://your-app.railway.app/api`
   - Redeploy

### Step 3: Set Up MongoDB Atlas (5 minutes)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. **Create free account**
3. **Create cluster** (free tier)
4. **Create database user:**
   - Database Access → Add New User
   - Username/Password
5. **Whitelist IP:**
   - Network Access → Add IP Address
   - Use `0.0.0.0/0` for all IPs (or your Railway IP)
6. **Get connection string:**
   - Click **Connect** → **Connect your application**
   - Copy connection string
   - Replace `<password>` with your password
   - Use this in Railway `MONGODB_URI`

### Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Test issue submission
3. Test admin login
4. Check Railway logs if issues occur

## ✅ Done!

Your app is now live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`

## 🔧 Troubleshooting

**Backend not working?**
- Check Railway logs
- Verify MongoDB connection string
- Check environment variables

**CORS errors?**
- Make sure `FRONTEND_URL` is set in Railway
- Check backend CORS settings

**File uploads not working?**
- Railway has persistent storage, but consider Cloudinary for production
- Check file size limits

## 📝 Notes

- Railway free tier: 500 hours/month
- Vercel free tier: Unlimited for personal projects
- MongoDB Atlas free tier: 512MB storage
- All free tiers are perfect for getting started!

