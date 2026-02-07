# Unified Civic Issue Detection & Grievance Redressal Platform

A comprehensive platform for citizens to report civic issues, track their resolution status, and interact with an AI-powered chatbot for assistance.

## Features

- 📍 **Location Detection**: Automatically detects user's current location
- 📸 **Image Upload & Camera**: Upload images or capture photos directly from camera
- 🤖 **AI-Powered Category Detection**: Gemini AI automatically detects issue category from image and description
- 🏢 **Smart Department Routing**: Automatically routes issues to appropriate departments
- 📊 **Issue Tracking**: Real-time tracking of issue status (Pending/In Progress/Resolved)
- 🤖 **AI Chatbot**: Intelligent chatbot to answer citizen queries
- 🔐 **Admin Portal**: Secure authentication for administrators only
- 👥 **Public Access**: Citizens can raise queries without registration

## Tech Stack

### Frontend
- Next.js 14 (React Framework)
- Tailwind CSS (Styling)
- React Hook Form (Form Management)
- Axios (API Calls)

### Backend
- Node.js & Express.js
- MongoDB (Database)
- JWT (Authentication)
- Multer (File Upload)
- Google Gemini AI (Category Detection)
- OpenAI API (AI Chatbot - Optional)

## Project Structure

```
.
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── package.json       # Root package.json
└── README.md          # This file
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- Gemini API key (for automatic category detection) - Get it from [Google AI Studio](https://makersuite.google.com/app/apikey)
- OpenAI API key (optional, for chatbot)

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**

   Create `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/civic-issues
   JWT_SECRET=your-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key
   OPENAI_API_KEY=your-openai-api-key-optional
   UPLOAD_DIR=./uploads
   ```

   Create `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on `http://localhost:3000`
   - Backend on `http://localhost:5000`

## Usage

### For Citizens
1. Visit the homepage
2. Allow location access when prompted
3. Upload an image of the civic issue
4. Fill in issue details
5. Submit the issue
6. Use the tracking ID to check status

### For Admins
1. Navigate to `/admin/login`
2. Sign up (first time) or login
3. Access admin dashboard to manage issues

## API Endpoints

- `POST /api/issues` - Submit a new issue
- `GET /api/issues/:id` - Get issue details
- `GET /api/issues/track/:trackingId` - Track issue by ID
- `POST /api/admin/login` - Admin login
- `POST /api/admin/signup` - Admin signup
- `POST /api/chatbot` - Chat with AI bot
- `PUT /api/admin/issues/:id` - Update issue status (Admin only)

## Deployment

### Frontend (Vercel)
- **[VERCEL_QUICK_FIX.md](./VERCEL_QUICK_FIX.md)** - Quick Vercel deployment
- **[VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)** - Detailed Vercel guide

### Backend (Render)
- **[RENDER_QUICK_START.md](./RENDER_QUICK_START.md)** - Fast Render deployment (5 min)
- **[RENDER_DEPLOY.md](./RENDER_DEPLOY.md)** - Complete Render guide
- **[RENDER_STEP_BY_STEP.md](./RENDER_STEP_BY_STEP.md)** - Step-by-step with details

### Quick Start Deployment

1. **Frontend**: Deploy to Vercel (Next.js optimized)
2. **Backend**: Deploy to Render (Express.js friendly) - **See RENDER_QUICK_START.md**
3. **Database**: Use MongoDB Atlas (free tier available)

See the deployment guides for step-by-step instructions.

## License

MIT

