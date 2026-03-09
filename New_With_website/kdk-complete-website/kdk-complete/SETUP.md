# Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **Python** 3.8 or higher ([Download](https://www.python.org/downloads/))
- **MongoDB** (see installation options below)
- **Git** (optional, for version control)

## Installation Steps

### 1. Extract the Project

If you received this as a zip file, extract it to your desired location.

```bash
cd kdk-college-ai-assistant
```

### 2. Install Frontend Dependencies

```bash
npm install
```

This will install all required Node.js packages including:
- Next.js
- React
- Tailwind CSS
- shadcn/ui components
- And all other dependencies

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

This installs:
- FastAPI
- Uvicorn (ASGI server)
- Motor (async MongoDB driver)
- Pydantic
- Python-multipart

**Alternative: Use a virtual environment (recommended)**

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cd ..
```

### 4. Setup MongoDB

Choose one of these options:

#### Option A: Docker (Easiest)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: MongoDB Community Edition

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**Windows:**
Download and install from https://www.mongodb.com/try/download/community

#### Option C: MongoDB Atlas (Cloud)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `backend/.env` with your connection string

### 5. Configure Environment Variables (Optional)

**Frontend (.env.local):**
```bash
cp .env.example .env.local
```

Edit `.env.local` if needed:
```
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

**Backend (backend/.env):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` if needed:
```
MONGODB_URL=mongodb://localhost:27017
```

### 6. Run the Application

From the project root directory:

```bash
npm run dev
```

This single command will start:
- ✅ FastAPI backend on http://127.0.0.1:8000
- ✅ Next.js frontend on http://localhost:3000

You should see output like:
```
[0] INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
[1] ▲ Next.js 16.0.10
[1] - Local:        http://localhost:3000
```

## Verification

### Test the Frontend
1. Open http://localhost:3000 in your browser
2. You should see the KDK College AI Assistant interface

### Test the Backend
1. Open http://127.0.0.1:8000/docs in your browser
2. You should see the FastAPI Swagger documentation

### Test the Database
```bash
# Connect to MongoDB
mongosh

# Switch to the database
use kdk_college_db

# Check collections (should be empty initially)
show collections
```

## First Time Usage

1. Navigate to http://localhost:3000
2. Click "Create account" or go to http://localhost:3000/signup
3. Sign up with email ending in `@kdk.edu` or `@kdkce.edu.in`
   - Email: `test@kdkce.edu.in`
   - Password: `test123` (minimum 6 characters)
4. You'll be automatically redirected to the chat interface
5. Send a test message!

## Verify Everything Works

Open your browser's DevTools (F12) and check:

1. **Console:** Should have no errors
2. **Network:** Should show successful API calls to http://127.0.0.1:8000
3. **Application → Local Storage:** Should see `kdk_user` with your MongoDB ID

## Common Issues & Solutions

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find and kill the process
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Port 8000 already in use

**Solution:**
Edit `package.json` and change the backend port:
```json
"dev:backend": "cd backend && python3 -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload"
```

Also update `lib/api.ts`:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8001'
```

### Issue: MongoDB connection refused

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Make sure MongoDB is running: `mongosh` should connect
- Check MongoDB status: `brew services list` (macOS) or `sudo systemctl status mongodb` (Linux)
- Restart MongoDB if needed

### Issue: Module not found errors

**Error:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Issue: TypeScript errors

**Solution:**
```bash
# Delete cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

## Development Commands

```bash
# Start development servers (frontend + backend)
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend

# Build for production
npm run build

# Run linter
npm run lint
```

## Next Steps

- Read `README.md` for detailed documentation
- Read `CHANGES.md` to understand the integration
- Explore API docs at http://127.0.0.1:8000/docs
- Start customizing the application!

## Need Help?

Check these resources:
- **Next.js Docs:** https://nextjs.org/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **MongoDB Docs:** https://www.mongodb.com/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs

## Production Deployment

For production deployment, see `DEPLOYMENT.md` (included in this package).
