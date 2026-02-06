# Project Structure

```
civic-issue-platform/
├── frontend/                 # Next.js Frontend Application
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # Admin pages
│   │   │   ├── login/      # Admin login/signup page
│   │   │   └── dashboard/  # Admin dashboard
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # React Components
│   │   ├── Navbar.tsx      # Navigation bar
│   │   ├── IssueForm.tsx   # Issue submission form
│   │   ├── Chatbot.tsx     # AI chatbot interface
│   │   └── TrackingModal.tsx # Issue tracking modal
│   ├── package.json        # Frontend dependencies
│   ├── next.config.js      # Next.js configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── tsconfig.json       # TypeScript configuration
│
├── backend/                 # Express.js Backend API
│   ├── models/             # MongoDB Models
│   │   ├── Admin.js        # Admin user model
│   │   └── Issue.js        # Issue model
│   ├── routes/             # API Routes
│   │   ├── issues.js       # Issue endpoints
│   │   ├── admin.js        # Admin endpoints
│   │   └── chatbot.js      # Chatbot endpoint
│   ├── middleware/         # Express Middleware
│   │   └── auth.js         # JWT authentication
│   ├── uploads/            # Uploaded images directory
│   ├── server.js           # Express server entry point
│   └── package.json        # Backend dependencies
│
├── package.json            # Root package.json
├── README.md               # Main documentation
├── SETUP.md                # Setup instructions
└── .gitignore             # Git ignore rules
```

## Key Files

### Frontend

- **`app/page.tsx`**: Main homepage with location detection, issue form, chatbot, and tracking
- **`app/admin/login/page.tsx`**: Admin authentication (login/signup)
- **`app/admin/dashboard/page.tsx`**: Admin dashboard for managing issues
- **`components/IssueForm.tsx`**: Form for submitting civic issues
- **`components/Chatbot.tsx`**: AI chatbot interface component
- **`components/TrackingModal.tsx`**: Modal for tracking issue status

### Backend

- **`server.js`**: Express server setup and MongoDB connection
- **`models/Issue.js`**: Issue schema with auto-assignment to departments
- **`models/Admin.js`**: Admin user schema with password hashing
- **`routes/issues.js`**: Issue submission and tracking endpoints
- **`routes/admin.js`**: Admin authentication and issue management
- **`routes/chatbot.js`**: AI chatbot endpoint with OpenAI integration
- **`middleware/auth.js`**: JWT authentication middleware

## Data Flow

1. **Issue Submission**:
   - User allows location access → Gets coordinates
   - User uploads image and fills form → Submits to `/api/issues`
   - Backend saves to MongoDB → Returns tracking ID
   - Issue auto-assigned to department based on category

2. **Issue Tracking**:
   - User enters tracking ID → Fetches from `/api/issues/track/:id`
   - Displays issue status and details

3. **Admin Management**:
   - Admin logs in → Receives JWT token
   - Fetches issues from `/api/admin/issues`
   - Updates status → Saves to database

4. **AI Chatbot**:
   - User sends message → POST to `/api/chatbot`
   - Backend uses OpenAI API (or fallback responses)
   - Returns answer to user

## Database Schema

### Issue Collection
```javascript
{
  trackingId: String (unique, auto-generated),
  title: String,
  description: String,
  category: String (road/water/electricity/sanitation/parks/other),
  status: String (pending/in_progress/resolved),
  latitude: Number,
  longitude: Number,
  address: String,
  imageUrl: String,
  department: String (auto-assigned),
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

