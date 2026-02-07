# 🚀 Quick Start - Deploy to Render (5 minutes)

## Fastest Way to Deploy Backend

### 1. Go to Render
Visit [render.com](https://render.com) and sign up with GitHub

### 2. Create Web Service
- Click **New +** → **Web Service**
- Connect your GitHub repo: `OnishNimiwal/round3`
- Click **Connect**

### 3. Configure (IMPORTANT!)

Fill these fields:

```
Name: civic-issue-backend
Root Directory: backend  ⚠️ MUST SET THIS!
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### 4. Add Environment Variables

Click **Add Environment Variable** for each:

```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/civic-issues
JWT_SECRET=your-random-secret-key
GEMINI_API_KEY=your-gemini-key
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### 5. Deploy
- Click **Create Web Service**
- Wait 2-5 minutes
- Get your URL: `https://your-app.onrender.com`

### 6. Update Frontend
- Go to Vercel Dashboard
- Update `NEXT_PUBLIC_API_URL` to your Render URL + `/api`
- Redeploy frontend

## ✅ Done!

Your backend is now live!

## ⚠️ Most Common Mistake

**Forgetting to set Root Directory to `backend`!**

Make sure it's set in Render settings, or deployment will fail.

---

**Need help?** Check `RENDER_DEPLOY.md` for detailed guide.

