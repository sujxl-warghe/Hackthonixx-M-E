# Quick Reference Guide

One-page cheat sheet for the KDK College AI Assistant.

## 🚀 Commands

```bash
# Install dependencies
npm install
cd backend && pip install -r requirements.txt && cd ..

# Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo

# Run application (dev mode)
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## 📂 File Locations

| Path | Description |
|------|-------------|
| `app/` | Next.js pages |
| `components/` | React components |
| `context/` | React Context (state) |
| `lib/api.ts` | **API adapter layer** |
| `lib/auth.ts` | Auth utilities |
| `backend/main.py` | **FastAPI server** |
| `package.json` | **Modified - dev scripts** |

## 🔑 Key Files Modified

1. **`lib/api.ts`** - Removed JWT, added FastAPI endpoints
2. **`context/AuthContext.tsx`** - Store user instead of tokens
3. **`app/signup/page.tsx`** - New signup page
4. **`backend/main.py`** - New FastAPI server
5. **`package.json`** - Added concurrently

## 🌐 URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main app |
| Backend | http://127.0.0.1:8000 | API server |
| API Docs | http://127.0.0.1:8000/docs | Swagger UI |
| MongoDB | mongodb://localhost:27017 | Database |

## 📝 Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Home page |
| `/signup` | `app/signup/page.tsx` | User registration |
| `/login` | `app/login/page.tsx` | User login |
| `/chat` | `app/chat/page.tsx` | Main chat interface |

## 🔌 API Endpoints

### Authentication

```http
POST /auth/signup
Body: {email, password}
Response: {id, email}

POST /auth/login
Body: {email, password}
Response: {id, email}
```

### Chat

```http
POST /chat
Body: {message, user_id?}
Response: {answer}
```

### Files

```http
POST /documents/upload?user_id=<id>
Body: FormData(file)
Response: {id, filename, message}
```

## 💾 LocalStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `kdk_user` | `{id, email}` | Current user |
| `kdk_chat_sessions` | `ChatSession[]` | Chat history |
| `kdk_current_session` | `string` | Active session ID |

## 🗄️ MongoDB Collections

```javascript
// users
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  created_at: Date
}

// chats
{
  _id: ObjectId,
  user_id: string?,
  message: string,
  timestamp: Date
}

// documents
{
  _id: ObjectId,
  user_id: string,
  filename: string,
  content_type: string,
  uploaded_at: Date
}
```

## 🎯 Context API

### AuthContext

```typescript
const { user, isAuthenticated, login, logout } = useAuth()

// user: {id, email} | null
// isAuthenticated: boolean
// login: (email, password) => Promise<void>
// logout: () => Promise<void>
```

### ChatContext

```typescript
const {
  sessions,
  currentSession,
  messages,
  sendMessage,
  createNewSession,
  addUploadedFile
} = useChat()
```

## 🔧 Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

### Backend (`backend/.env`)

```env
MONGODB_URL=mongodb://localhost:27017
```

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` |
| Port 8000 in use | `lsof -ti:8000 \| xargs kill -9` |
| MongoDB not running | `docker run -d -p 27017:27017 mongo` |
| Module not found | `npm install` or `pip install -r requirements.txt` |
| CORS error | Check `allow_origins` in `backend/main.py` |

## 📦 Dependencies

### Frontend

```json
{
  "next": "16.0.10",
  "react": "19.2.0",
  "tailwindcss": "^4.1.9",
  "lucide-react": "^0.454.0",
  "concurrently": "^9.1.2"
}
```

### Backend

```txt
fastapi==0.115.6
uvicorn[standard]==0.34.0
motor==3.6.0
pydantic[email]==2.10.5
python-multipart==0.0.20
```

## 🧪 Testing Checklist

```bash
# 1. Check MongoDB
mongosh

# 2. Check backend
curl http://127.0.0.1:8000/

# 3. Check frontend
curl http://localhost:3000/

# 4. Check API docs
open http://127.0.0.1:8000/docs

# 5. Test signup
# Go to http://localhost:3000/signup
# Email: test@kdkce.edu.in
# Password: test123

# 6. Check localStorage
# DevTools > Application > Local Storage
# Should see: kdk_user
```

## 🔐 Security Checklist (Production)

- [ ] Change password hashing to bcrypt
- [ ] Use httpOnly cookies
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Add input validation
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Add CSRF protection
- [ ] Implement logging

## 📊 Project Stats

- **Frontend Files Modified:** 5
- **Backend Files Added:** 2
- **Total Components:** 70+
- **API Endpoints:** 4
- **Database Collections:** 3
- **Lines of Code:** ~5000+

## 🎓 Tech Stack Summary

```
Frontend: Next.js + React + TypeScript + Tailwind
Backend:  FastAPI + Python + Uvicorn
Database: MongoDB + Motor
State:    React Context API
Auth:     MongoDB ID (no JWT)
Styling:  shadcn/ui + Tailwind CSS
```

## 📚 Documentation Files

- `INDEX.md` - Start here
- `SETUP.md` - Installation guide
- `README.md` - Project overview
- `ARCHITECTURE.md` - System design
- `TROUBLESHOOTING.md` - Fix issues
- `DEPLOYMENT.md` - Production deploy
- `CHANGES.md` - Technical details
- `QUICK_REFERENCE.md` - This file

## 🔗 Useful Links

- Next.js: https://nextjs.org/docs
- FastAPI: https://fastapi.tiangolo.com/
- MongoDB: https://www.mongodb.com/docs/
- Tailwind: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/

---

**Print this page for quick reference while developing!**
