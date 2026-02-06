# Deployment Guide - Vercel

This guide will help you deploy your Civic Issue Platform to Vercel.

## Deployment Strategy

Since you have a **Next.js frontend** and **Express.js backend**, we have two options:

### Option 1: Frontend on Vercel + Backend on Railway/Render (Recommended)
- **Frontend**: Deploy Next.js to Vercel (easy, optimized)
- **Backend**: Deploy Express.js to Railway or Render (better for file uploads and persistent storage)

### Option 2: Everything on Vercel
- **Frontend**: Deploy Next.js to Vercel
- **Backend**: Convert to Vercel Serverless Functions (requires refactoring)

We'll use **Option 1** as it's simpler and better for your use case.

---

## Part 1: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

1. **Create `vercel.json` in the root** (already created below)
2. **Update environment variables** in Vercel dashboard

### Step 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project root
cd "C:\Users\NIKKA\OneDrive\Desktop\round 3"

# Login to Vercel
vercel login

# Deploy (select frontend folder when prompted)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? civic-issue-platform
# - Directory? ./frontend
# - Override settings? N
```

### Step 3: Set Environment Variables in Vercel

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   ```
   (Replace with your actual backend URL after deploying backend)

### Step 4: Redeploy

After setting environment variables, trigger a new deployment or wait for the next push.

---

## Part 2: Deploy Backend to Railway (Recommended)

Railway is excellent for Express.js apps with file uploads.

### Step 1: Prepare Backend

1. **Create `railway.json`** (optional, for Railway)
2. **Set up MongoDB Atlas** (cloud database)

### Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Click **Connect** → **Connect your application**
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your database password
7. Add your IP address to whitelist (or use `0.0.0.0/0` for all IPs in development)

### Step 3: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Sign up/login with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Railway will auto-detect it's a Node.js app
6. Set the **Root Directory** to `backend`
7. Add environment variables in Railway dashboard:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-issues?retryWrites=true&w=majority
JWT_SECRET=your-strong-secret-key-here
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key-optional
NODE_ENV=production
```

8. Railway will automatically deploy and give you a URL like: `https://your-app.railway.app`

### Step 4: Update Frontend Environment Variable

Go back to Vercel and update `NEXT_PUBLIC_API_URL` to your Railway backend URL.

---

## Part 3: Alternative - Deploy Backend to Render

### Step 1: Create Account

1. Go to [Render](https://render.com)
2. Sign up/login with GitHub

### Step 2: Create Web Service

1. Click **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: civic-issue-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables

Add the same environment variables as Railway.

### Step 4: Deploy

Click **Create Web Service** and wait for deployment.

---

## Part 4: File Storage (Important!)

Since Vercel and most serverless platforms have **ephemeral file systems**, uploaded files will be lost. You need cloud storage:

### Option A: Use Cloudinary (Recommended)

1. Sign up at [Cloudinary](https://cloudinary.com) (free tier available)
2. Install package:
   ```bash
   cd backend
   npm install cloudinary multer-storage-cloudinary
   ```
3. Update `backend/routes/issues.js` to use Cloudinary instead of local storage

### Option B: Use AWS S3

Similar setup with AWS S3 bucket.

### Option C: Keep Local Storage (Railway/Render)

Railway and Render have persistent storage, so local file uploads will work, but files will be lost if you redeploy. Not recommended for production.

---

## Part 5: Update CORS Settings

Update `backend/server.js` to allow your Vercel frontend:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app'
  ],
  credentials: true
}))
```

---

## Quick Deploy Checklist

- [ ] MongoDB Atlas cluster created and connection string obtained
- [ ] Backend deployed to Railway/Render
- [ ] Backend environment variables set
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable `NEXT_PUBLIC_API_URL` set
- [ ] CORS updated in backend
- [ ] File storage configured (Cloudinary recommended)
- [ ] Test the deployed application

---

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check environment variables

### CORS errors
- Update CORS origin in backend to include Vercel URL
- Check if backend URL is correct in frontend env vars

### File uploads not working
- Implement Cloudinary or S3 for production
- Check file size limits

### Environment variables not working
- Redeploy after adding env vars
- Check variable names (case-sensitive)
- Verify `NEXT_PUBLIC_` prefix for frontend vars

---

## Production Considerations

1. **Use MongoDB Atlas** (not local MongoDB)
2. **Use Cloudinary/S3** for image storage
3. **Set strong JWT_SECRET**
4. **Enable HTTPS** (automatic on Vercel/Railway)
5. **Set up monitoring** (Railway/Render have built-in logs)
6. **Configure custom domain** (optional)

---

## Next Steps After Deployment

1. Test all features on production
2. Set up error monitoring (Sentry, etc.)
3. Configure custom domains
4. Set up CI/CD for automatic deployments
5. Add rate limiting for API endpoints

