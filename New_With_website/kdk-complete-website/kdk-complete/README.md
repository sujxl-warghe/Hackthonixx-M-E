# KDK College AI Assistant

Full-stack application with Next.js frontend and FastAPI + MongoDB backend.

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- MongoDB (running locally on default port 27017)

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Start MongoDB

Make sure MongoDB is running on `mongodb://localhost:27017`

```bash
# If using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or start your local MongoDB service
```

### 4. Run the Application

**Single command to start both frontend and backend:**

```bash
npm run dev
```

This will start:
- FastAPI backend on `http://127.0.0.1:8000`
- Next.js frontend on `http://localhost:3000`

## Application Features

### Authentication (No JWT)
- **Signup**: `/signup` - Create account with college email
- **Login**: `/login` - Login with credentials
- User data stored in localStorage (MongoDB ID + email)

### Chat
- Public chat (no login required)
- Private chat (requires login, user identified by MongoDB `_id`)

### Document Upload
- Upload documents tied to user account

## API Endpoints

### Auth
- `POST /auth/signup` - Create new user
- `POST /auth/login` - Login user

### Chat
- `POST /chat` - Send message (with optional `user_id`)

### Documents
- `POST /documents/upload?user_id=<id>` - Upload document

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── chat/              # Chat page
│   ├── login/             # Login page
│   ├── signup/            # Signup page (NEW)
│   └── layout.tsx
├── components/            # React components
├── context/               # React Context (Auth, Chat)
├── lib/
│   ├── api.ts            # API adapter layer (UPDATED)
│   └── auth.ts           # Auth helpers (UPDATED)
├── backend/              # FastAPI backend (NEW)
│   ├── main.py          # FastAPI application
│   └── requirements.txt  # Python dependencies
└── package.json          # Node.js dependencies

```

## Environment Variables (Optional)

Create `.env.local` in the root:

```env
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

Create `.env` in `backend/`:

```env
MONGODB_URL=mongodb://localhost:27017
```

## Development Notes

- No JWT tokens - users identified by MongoDB `_id` stored in localStorage
- Sessions stored in localStorage (frontend only)
- Backend uses simple password hashing (SHA256 - use bcrypt in production)
- CORS enabled for localhost:3000

## Production Deployment

For production:
1. Use proper password hashing (bcrypt)
2. Enable HTTPS
3. Use httpOnly cookies for user sessions
4. Configure proper CORS origins
5. Use environment variables for sensitive data
6. Deploy MongoDB with authentication
