# KDK College AI Assistant - Complete Project

**Full-Stack AI Chatbot Application**

Next.js Frontend + FastAPI Backend + MongoDB Database

---

## 🚀 Quick Start (3 Steps)

```bash
# 1. Install dependencies
npm install
cd backend && pip install -r requirements.txt && cd ..

# 2. Start MongoDB
docker run -d -p 27017:27017 --name mongodb mongo

# 3. Run the app
npm run dev
```

**Done!** Open http://localhost:3000

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[SETUP.md](SETUP.md)** | ⭐ **START HERE** - Complete installation guide |
| **[README.md](README.md)** | Project overview and features |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Fix common issues |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Deploy to production |
| **[CHANGES.md](CHANGES.md)** | Technical integration details |

---

## 📁 Project Structure

```
kdk-college-ai-assistant/
│
├── 📄 Documentation
│   ├── INDEX.md (this file)
│   ├── SETUP.md              ⭐ Start here
│   ├── README.md
│   ├── TROUBLESHOOTING.md
│   ├── DEPLOYMENT.md
│   └── CHANGES.md
│
├── 🎨 Frontend (Next.js)
│   ├── app/                  # Pages
│   │   ├── chat/            # Main chat interface
│   │   ├── login/           # Login page
│   │   └── signup/          # Signup page (new)
│   ├── components/          # React components
│   │   ├── ChatWindow.tsx
│   │   ├── Composer.tsx
│   │   ├── MessageList.tsx
│   │   ├── Sidebar.tsx
│   │   └── ui/              # shadcn components
│   ├── context/             # React Context
│   │   ├── AuthContext.tsx  # Authentication
│   │   └── ChatContext.tsx  # Chat state
│   ├── lib/                 # Utilities
│   │   ├── api.ts           # API layer (modified)
│   │   ├── auth.ts          # Auth helpers (modified)
│   │   └── utils.ts
│   └── public/              # Static assets
│
├── ⚙️ Backend (FastAPI)
│   ├── main.py              # FastAPI app (new)
│   ├── requirements.txt     # Python deps (new)
│   └── .env.example
│
└── 📦 Configuration
    ├── package.json         # Node.js deps (modified)
    ├── tsconfig.json
    ├── next.config.mjs
    └── .env.example
```

---

## ✨ Features

### Authentication
- ✅ Signup with college email
- ✅ Login with credentials
- ✅ No JWT - MongoDB ID-based auth
- ✅ LocalStorage for user persistence

### Chat
- ✅ Public chat (no login needed)
- ✅ Private chat (for logged-in users)
- ✅ Real-time messaging
- ✅ Session history
- ✅ Academic query detection

### File Management
- ✅ Document uploads
- ✅ File preview chips
- ✅ User-specific file storage

### UI/UX
- ✅ Modern, responsive design
- ✅ Dark/light theme support
- ✅ shadcn/ui components
- ✅ Tailwind CSS styling

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Library:** shadcn/ui
- **State:** React Context API
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.8+
- **Server:** Uvicorn
- **Validation:** Pydantic

### Database
- **Database:** MongoDB
- **Driver:** Motor (async)
- **Collections:** users, chats, documents

---

## 🎯 How It Works

### Authentication Flow
```
User → Signup (/signup)
     → POST /auth/signup
     → Backend creates user in MongoDB
     → Returns {id, email}
     → Frontend stores in localStorage
     → Redirect to /chat
```

### Chat Flow
```
User → Type message
     → Check if authenticated
     → POST /chat with {message, user_id?}
     → Backend processes & saves to MongoDB
     → Returns {answer}
     → Display response
```

### File Upload Flow
```
User → Select file
     → POST /documents/upload?user_id=<id>
     → Backend saves metadata to MongoDB
     → Returns confirmation
     → Show file chip in UI
```

---

## 🔧 Development

### Run Development Servers

```bash
# Both frontend + backend
npm run dev

# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://127.0.0.1:8000
- **API Docs:** http://127.0.0.1:8000/docs
- **MongoDB:** mongodb://localhost:27017

### Test Signup

1. Go to http://localhost:3000/signup
2. Email: `test@kdkce.edu.in`
3. Password: `test123`
4. Click "Create account"

### Test Chat

1. Send message: "What is DSA?"
2. Check response from backend
3. Open DevTools → Application → Local Storage
4. Verify `kdk_user` is stored

---

## 📋 API Endpoints

### Authentication

**Signup**
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@kdkce.edu.in",
  "password": "password123"
}

Response: {
  "id": "507f1f77bcf86cd799439011",
  "email": "user@kdkce.edu.in"
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@kdkce.edu.in",
  "password": "password123"
}

Response: {
  "id": "507f1f77bcf86cd799439011",
  "email": "user@kdkce.edu.in"
}
```

### Chat

**Send Message**
```http
POST /chat
Content-Type: application/json

{
  "message": "What is the Pythagorean theorem?",
  "user_id": "507f1f77bcf86cd799439011"  // Optional
}

Response: {
  "answer": "The Pythagorean theorem states that..."
}
```

### Documents

**Upload File**
```http
POST /documents/upload?user_id=507f1f77bcf86cd799439011
Content-Type: multipart/form-data

file: <binary data>

Response: {
  "id": "507f1f77bcf86cd799439012",
  "filename": "notes.pdf",
  "message": "File uploaded successfully"
}
```

---

## 🔐 Security Notes

### Current Implementation (Development)

- ⚠️ Passwords hashed with SHA256 (NOT production-ready)
- ⚠️ User stored in localStorage (NOT secure for production)
- ⚠️ No rate limiting
- ⚠️ CORS open to localhost

### For Production (See DEPLOYMENT.md)

- ✅ Use bcrypt for password hashing
- ✅ Use httpOnly cookies for sessions
- ✅ Add rate limiting
- ✅ Configure proper CORS
- ✅ Enable HTTPS
- ✅ Add input validation
- ✅ Implement CSRF protection

---

## 🧪 Testing

### Manual Testing Checklist

**Frontend:**
- [ ] Can access homepage
- [ ] Can navigate to /signup
- [ ] Can navigate to /login
- [ ] Can navigate to /chat
- [ ] Styles load correctly
- [ ] No console errors

**Backend:**
- [ ] API docs accessible at /docs
- [ ] Can signup new user
- [ ] Can login existing user
- [ ] Can send chat message
- [ ] Can upload file

**Database:**
- [ ] MongoDB running
- [ ] Can connect via mongosh
- [ ] Users collection exists after signup
- [ ] Chats collection exists after message

**Integration:**
- [ ] Signup → stores user → redirects to /chat
- [ ] Login → stores user → redirects to /chat
- [ ] Chat → sends to backend → receives response
- [ ] File upload → sends to backend → success

### Test Scenarios

**1. New User Flow**
```
1. Go to /signup
2. Enter: test@kdkce.edu.in / test123
3. Click "Create account"
4. Should redirect to /chat
5. Should see user in localStorage
6. Send message: "Hello"
7. Should get response
```

**2. Returning User Flow**
```
1. Go to /login
2. Enter credentials
3. Click "Sign in"
4. Should redirect to /chat
5. Previous messages should load (if implemented)
```

**3. Public Chat Flow**
```
1. Clear localStorage
2. Go to /chat
3. Send message
4. Should get limited/public response
```

---

## 📊 Database Schema

### users Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "student@kdkce.edu.in",
  password: "<hashed>",
  created_at: ISODate("2026-02-04T10:00:00Z")
}
```

### chats Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  user_id: "507f1f77bcf86cd799439011",  // null for public
  message: "What is DSA?",
  timestamp: ISODate("2026-02-04T10:01:00Z")
}
```

### documents Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  user_id: "507f1f77bcf86cd799439011",
  filename: "notes.pdf",
  content_type: "application/pdf",
  uploaded_at: ISODate("2026-02-04T10:02:00Z")
}
```

---

## 🤝 Contributing

Want to improve this project?

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is provided as-is for educational purposes.

---

## 🆘 Need Help?

1. **Check:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Read:** [SETUP.md](SETUP.md)
3. **Deploy:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🎓 Learn More

- **Next.js:** https://nextjs.org/docs
- **FastAPI:** https://fastapi.tiangolo.com/
- **MongoDB:** https://www.mongodb.com/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/

---

**Ready to start? Open [SETUP.md](SETUP.md)** 🚀
