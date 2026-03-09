# System Architecture

## Overview

The KDK College AI Assistant is a full-stack web application with three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Next.js Frontend (React)                   │    │
│  │                                                     │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │  Signup  │  │  Login   │  │   Chat   │         │    │
│  │  │  Page    │  │  Page    │  │  Page    │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────┐          │    │
│  │  │      Context API (State)             │          │    │
│  │  │  • AuthContext                       │          │    │
│  │  │  • ChatContext                       │          │    │
│  │  └──────────────────────────────────────┘          │    │
│  │                                                     │    │
│  │  ┌──────────────────────────────────────┐          │    │
│  │  │      API Layer (lib/api.ts)          │          │    │
│  │  └──────────────────────────────────────┘          │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                  │
│                          │ HTTP/HTTPS                       │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               FastAPI Backend (Python)                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              API Endpoints                          │    │
│  │                                                     │    │
│  │  POST /auth/signup    ─┐                           │    │
│  │  POST /auth/login      │─── Authentication         │    │
│  │                        │                            │    │
│  │  POST /chat           ─┘─── Core Features          │    │
│  │                                                     │    │
│  │  POST /documents/upload ─── File Management        │    │
│  │                                                     │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                  │
│                          │ Motor (Async Driver)             │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Database                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    users     │  │    chats     │  │  documents   │     │
│  │  collection  │  │  collection  │  │  collection  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Signup Flow

```
┌──────┐                ┌──────────┐                ┌─────────┐                ┌─────────┐
│ User │                │ Frontend │                │ Backend │                │ MongoDB │
└──┬───┘                └────┬─────┘                └────┬────┘                └────┬────┘
   │                         │                           │                          │
   │ 1. Enter email/password │                           │                          │
   │ ─────────────────────>  │                           │                          │
   │                         │                           │                          │
   │                         │ 2. POST /auth/signup      │                          │
   │                         │ ───────────────────────>  │                          │
   │                         │                           │                          │
   │                         │                           │ 3. Insert user           │
   │                         │                           │ ──────────────────────>  │
   │                         │                           │                          │
   │                         │                           │ 4. Return inserted_id    │
   │                         │                           │ <────────────────────── │
   │                         │                           │                          │
   │                         │ 5. {id, email}            │                          │
   │                         │ <───────────────────────  │                          │
   │                         │                           │                          │
   │ 6. Store in localStorage│                           │                          │
   │ <─────────────────────  │                           │                          │
   │                         │                           │                          │
   │ 7. Redirect to /chat    │                           │                          │
   │ <─────────────────────  │                           │                          │
```

### 2. Chat Message Flow

```
┌──────┐                ┌──────────┐                ┌─────────┐                ┌─────────┐
│ User │                │ Frontend │                │ Backend │                │ MongoDB │
└──┬───┘                └────┬─────┘                └────┬────┘                └────┬────┘
   │                         │                           │                          │
   │ 1. Type message         │                           │                          │
   │ ─────────────────────>  │                           │                          │
   │                         │                           │                          │
   │                         │ 2. Get user from          │                          │
   │                         │    localStorage           │                          │
   │                         │                           │                          │
   │                         │ 3. POST /chat             │                          │
   │                         │    {message, user_id}     │                          │
   │                         │ ───────────────────────>  │                          │
   │                         │                           │                          │
   │                         │                           │ 4. Insert chat           │
   │                         │                           │ ──────────────────────>  │
   │                         │                           │                          │
   │                         │                           │ 5. Process message       │
   │                         │                           │    (AI logic here)       │
   │                         │                           │                          │
   │                         │ 6. {answer}               │                          │
   │                         │ <───────────────────────  │                          │
   │                         │                           │                          │
   │ 7. Display response     │                           │                          │
   │ <─────────────────────  │                           │                          │
```

### 3. File Upload Flow

```
┌──────┐                ┌──────────┐                ┌─────────┐                ┌─────────┐
│ User │                │ Frontend │                │ Backend │                │ MongoDB │
└──┬───┘                └────┬─────┘                └────┬────┘                └────┬────┘
   │                         │                           │                          │
   │ 1. Select file          │                           │                          │
   │ ─────────────────────>  │                           │                          │
   │                         │                           │                          │
   │                         │ 2. Get user_id from       │                          │
   │                         │    localStorage           │                          │
   │                         │                           │                          │
   │                         │ 3. POST /documents/upload │                          │
   │                         │    ?user_id=<id>          │                          │
   │                         │    FormData(file)         │                          │
   │                         │ ───────────────────────>  │                          │
   │                         │                           │                          │
   │                         │                           │ 4. Validate user         │
   │                         │                           │ ──────────────────────>  │
   │                         │                           │ <────────────────────── │
   │                         │                           │                          │
   │                         │                           │ 5. Save file metadata    │
   │                         │                           │ ──────────────────────>  │
   │                         │                           │                          │
   │                         │ 6. {id, filename}         │                          │
   │                         │ <───────────────────────  │                          │
   │                         │                           │                          │
   │ 7. Show file chip       │                           │                          │
   │ <─────────────────────  │                           │                          │
```

## Component Architecture

### Frontend Component Hierarchy

```
App Layout (layout.tsx)
│
├─ AuthProvider (context/AuthContext.tsx)
│  └─ Manages: user state, login, logout
│
├─ ChatProvider (context/ChatContext.tsx)
│  └─ Manages: sessions, messages, uploads
│
└─ Pages
   │
   ├─ Home (/)
   │  └─ page.tsx
   │
   ├─ Signup (/signup)
   │  └─ app/signup/page.tsx
   │
   ├─ Login (/login)
   │  └─ app/login/page.tsx
   │
   └─ Chat (/chat)
      └─ app/chat/page.tsx
         │
         ├─ Sidebar
         │  └─ components/Sidebar.tsx
         │     ├─ Session list
         │     └─ New chat button
         │
         ├─ ChatWindow
         │  └─ components/ChatWindow.tsx
         │     │
         │     ├─ MessageList
         │     │  └─ components/MessageList.tsx
         │     │     └─ Individual messages
         │     │
         │     └─ Composer
         │        └─ components/Composer.tsx
         │           ├─ Input field
         │           ├─ Send button
         │           └─ FileUploadChips
         │              └─ components/FileUploadChips.tsx
         │
         └─ File upload dropzone
```

### Backend Module Organization

```
backend/
│
├─ main.py
   │
   ├─ FastAPI App Instance
   │  └─ CORS middleware
   │
   ├─ MongoDB Client
   │  └─ Motor AsyncIOMotorClient
   │
   ├─ Pydantic Models
   │  ├─ SignupRequest
   │  ├─ LoginRequest
   │  ├─ ChatRequest
   │  ├─ UserResponse
   │  └─ ChatResponse
   │
   ├─ Helper Functions
   │  ├─ hash_password()
   │  └─ object_id_to_str()
   │
   └─ Route Handlers
      ├─ GET /
      ├─ POST /auth/signup
      ├─ POST /auth/login
      ├─ POST /chat
      └─ POST /documents/upload
```

## State Management

### Frontend State Flow

```
┌─────────────────────────────────────────────────────┐
│              Browser localStorage                    │
│                                                      │
│  kdk_user: {id, email}                              │
│  kdk_chat_sessions: [...]                           │
│  kdk_current_session: "session_id"                  │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ Read/Write
                   │
┌──────────────────▼──────────────────────────────────┐
│              React Context API                       │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  AuthContext                               │    │
│  │  • user: User | null                       │    │
│  │  • isAuthenticated: boolean                │    │
│  │  • login(email, password)                  │    │
│  │  • logout()                                │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │  ChatContext                               │    │
│  │  • sessions: ChatSession[]                 │    │
│  │  • currentSession: ChatSession | null      │    │
│  │  • messages: Message[]                     │    │
│  │  • uploadedFiles: UploadedFile[]           │    │
│  │  • sendMessage(content)                    │    │
│  │  • createNewSession()                      │    │
│  │  • addUploadedFile(file)                   │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                   │
                   │ Props/Hooks
                   │
┌──────────────────▼──────────────────────────────────┐
│              React Components                        │
│                                                      │
│  • Use useAuth() hook                               │
│  • Use useChat() hook                               │
│  • Render UI based on state                         │
└─────────────────────────────────────────────────────┘
```

## Security Architecture

### Current (Development)

```
User Input
    │
    ▼
Frontend Validation
    │
    ▼
HTTP Request (Plain)
    │
    ▼
Backend
    │
    ├─ Password: SHA256 Hash ⚠️
    ├─ CORS: localhost only ⚠️
    └─ No rate limiting ⚠️
    │
    ▼
MongoDB (No auth) ⚠️
```

### Production (Recommended)

```
User Input
    │
    ▼
Frontend Validation
    │
    ▼
HTTPS Request (TLS) ✅
    │
    ▼
Backend
    │
    ├─ Password: bcrypt ✅
    ├─ Rate Limiting ✅
    ├─ CSRF Protection ✅
    └─ Input Sanitization ✅
    │
    ▼
MongoDB
    │
    ├─ Authentication ✅
    ├─ Encryption at rest ✅
    └─ Network isolation ✅
```

## Deployment Architecture

### Development

```
┌────────────────────────────────────────┐
│         Developer Machine              │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  npm run dev (concurrently)      │ │
│  │                                  │ │
│  │  ┌────────────┐  ┌────────────┐ │ │
│  │  │  Next.js   │  │  FastAPI   │ │ │
│  │  │  :3000     │  │  :8000     │ │ │
│  │  └────────────┘  └────────────┘ │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │  MongoDB                         │ │
│  │  :27017 (Docker or local)        │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

### Production

```
┌─────────────────────────────────────────────────────┐
│                    Internet                          │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌───────────────┐
│ Vercel/       │      │ Railway/      │
│ Netlify       │      │ Render        │
│               │      │               │
│ Next.js App   │─────▶│ FastAPI App   │
│ (Frontend)    │ HTTPS│ (Backend)     │
│               │      │               │
└───────────────┘      └───────┬───────┘
                               │
                               │ Secure Connection
                               │
                       ┌───────▼───────┐
                       │ MongoDB Atlas │
                       │ (Cloud DB)    │
                       └───────────────┘
```

## Technology Stack Details

### Frontend Stack

```
Next.js 16 (React 19)
    │
    ├─ TypeScript
    ├─ App Router
    │
    ├─ Styling
    │  ├─ Tailwind CSS
    │  └─ shadcn/ui components
    │
    ├─ State Management
    │  └─ React Context API
    │
    ├─ HTTP Client
    │  └─ Fetch API
    │
    └─ Icons
       └─ Lucide React
```

### Backend Stack

```
FastAPI
    │
    ├─ Python 3.8+
    ├─ ASGI (async)
    │
    ├─ Server
    │  └─ Uvicorn
    │
    ├─ Database Driver
    │  └─ Motor (async MongoDB)
    │
    ├─ Validation
    │  └─ Pydantic
    │
    └─ File Handling
       └─ python-multipart
```

### Database

```
MongoDB
    │
    ├─ Document Database (NoSQL)
    ├─ Collections
    │  ├─ users
    │  ├─ chats
    │  └─ documents
    │
    └─ Indexes
       └─ email (unique)
```

## Performance Considerations

### Optimization Points

```
Frontend
    │
    ├─ Code Splitting (Next.js automatic)
    ├─ Image Optimization (Next.js Image)
    ├─ Lazy Loading
    └─ Caching (SWR or React Query)

Backend
    │
    ├─ Async Operations (Motor)
    ├─ Connection Pooling
    ├─ Database Indexing
    └─ Response Caching

Database
    │
    ├─ Indexes on frequent queries
    ├─ Limit query results
    └─ Aggregation pipelines
```

This architecture is designed to be:
- ✅ **Scalable:** Can handle growth
- ✅ **Maintainable:** Clear separation of concerns
- ✅ **Secure:** With proper production setup
- ✅ **Fast:** Async operations throughout
- ✅ **Developer-friendly:** Good DX with hot reload
