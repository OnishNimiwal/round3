# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Frontend (Next.js)
- Backend (Express.js)

### 2. Set Up Environment Variables

#### Backend Environment Variables

Create `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civic-issues
JWT_SECRET=your-secret-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key-optional
UPLOAD_DIR=./uploads
```

**Note:**
- `MONGODB_URI`: Make sure MongoDB is installed and running. You can use MongoDB Atlas (cloud) or local MongoDB.
- `JWT_SECRET`: Use a strong random string for production.
- `GEMINI_API_KEY`: Required for automatic category detection. Get it from [Google AI Studio](https://makersuite.google.com/app/apikey). If not provided, the system will use fallback text-based category detection.
- `OPENAI_API_KEY`: Optional. If not provided, the chatbot will use rule-based responses.

#### Frontend Environment Variables

Create `frontend/.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

**MongoDB Atlas (Cloud):**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get your connection string
- Update `MONGODB_URI` in `backend/.env`

### 4. Run the Application

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

### 5. Create Your First Admin Account

1. Navigate to http://localhost:3000/admin/login
2. Click "Don't have an account? Sign Up"
3. Enter your email and password
4. You'll be redirected to the admin dashboard

## Features Overview

### For Citizens (No Login Required)

1. **Report Issues**
   - Visit homepage
   - Allow location access
   - Take a photo with camera or upload image of the issue
   - Fill in title and description (category is auto-detected by AI)
   - Submit the issue
   - Receive a tracking ID

2. **Track Issues**
   - Click "Track Issue" button
   - Enter your tracking ID
   - View issue status and details

3. **AI Chatbot**
   - Click "Ask AI Assistant"
   - Ask questions about the platform
   - Get instant answers

### For Admins (Login Required)

1. **Login/Signup**
   - Navigate to `/admin/login`
   - Sign up (first time) or login
   - Access admin dashboard

2. **Manage Issues**
   - View all submitted issues
   - Filter by status (All/Pending/In Progress/Resolved)
   - Update issue status
   - View issue details and images

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGODB_URI` in `backend/.env`
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use

- Change `PORT` in `backend/.env`
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` accordingly

### Image Upload Issues

- Ensure `backend/uploads` directory exists
- Check file size (max 5MB)
- Supported formats: JPEG, JPG, PNG, GIF

### Location Not Working

- Ensure HTTPS or localhost (browsers require secure context for geolocation)
- Allow location permissions in browser
- The app will use coordinates if reverse geocoding fails

## Production Deployment

### Backend

1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Set up proper file storage (consider cloud storage like AWS S3)
4. Use a strong `JWT_SECRET`

### Frontend

1. Build the application: `cd frontend && npm run build`
2. Update `NEXT_PUBLIC_API_URL` to your production backend URL
3. Deploy to Vercel, Netlify, or your preferred hosting

## API Endpoints

- `POST /api/issues` - Submit a new issue
- `GET /api/issues/:id` - Get issue by ID
- `GET /api/issues/track/:trackingId` - Track issue by tracking ID
- `POST /api/admin/signup` - Admin signup
- `POST /api/admin/login` - Admin login
- `GET /api/admin/issues` - Get all issues (Admin only)
- `PUT /api/admin/issues/:id` - Update issue status (Admin only)
- `POST /api/chatbot` - Chat with AI bot

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express.js, MongoDB, JWT
- **AI**: 
  - Google Gemini API (for automatic category detection from images and descriptions)
  - OpenAI API (optional, for chatbot with fallback to rule-based responses)

