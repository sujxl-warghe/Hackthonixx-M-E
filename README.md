# KDK College AI Assistant

A full-stack AI-powered chat application built with FastAPI and Next.js, featuring Retrieval-Augmented Generation (RAG) capabilities and user authentication.

## Features

- **User Authentication**: Secure login and signup with JWT tokens
- **AI Chat**: Real-time chat with the Groq LLM API
- **RAG System**: Upload and retrieve documents for context-aware responses
- **Document Embedding**: Semantic search using sentence-transformers
- **Responsive UI**: Modern React/Next.js interface with Tailwind CSS
- **MongoDB Integration**: Scalable database for users and conversations

## Tech Stack

### Frontend
- **Next.js** - React framework with TypeScript
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Context API** - State management

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.8+** - Backend language
- **MongoDB** - Document database (via Motor)
- **Groq API** - LLM provider
- **Sentence-Transformers** - Embeddings for RAG
- **PyMuPDF** - PDF document processing
- **JWT** - Authentication tokens

## Prerequisites

- Python 3.8 or higher
- Node.js 16+ and npm/pnpm
- MongoDB (local or cloud instance)
- Groq API key
- Git

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd kdk-college-ai-fastapi
```

### Backend Setup

1. **Create and activate virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Create `.env` file** in `backend/`:
   ```env
   DATABASE_URL=mongodb://localhost:27017
   SECRET_KEY=your_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   GROQ_API_KEY=your_groq_api_key
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Create `.env.local` file** in root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## Running the Application

### Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### Start Frontend Server

```bash
npm run dev
# or
pnpm dev
```

The frontend will be available at: `http://localhost:3000`

## Project Structure

```
kdk-college-ai-fastapi/
├── app/                          # Next.js frontend
│   ├── chat/                     # Chat page
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ChatWindow.tsx            # Chat interface
│   ├── MessageList.tsx           # Messages display
│   ├── Composer.tsx              # Message input
│   ├── FileUploadChips.tsx       # File upload UI
│   ├── Sidebar.tsx               # Navigation sidebar
│   └── ui/                       # shadcn UI components
├── context/                      # React Context
│   ├── AuthContext.tsx           # Authentication state
│   └── ChatContext.tsx           # Chat state
├── lib/                          # Utility functions
│   ├── api.ts                    # API client
│   ├── auth.ts                   # Auth utilities
│   └── utils.ts                  # Helper functions
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py               # Entry point
│   │   ├── config.py             # Configuration
│   │   ├── database.py           # MongoDB setup
│   │   ├── auth/                 # Authentication routes
│   │   ├── chat/                 # Chat routes & Groq integration
│   │   └── rag/                  # RAG system
│   └── requirements.txt
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Chat
- `POST /chat/message` - Send chat message
- `GET /chat/history` - Get conversation history
- `DELETE /chat/conversation/{id}` - Delete conversation

### Documents (RAG)
- `POST /rag/upload` - Upload document
- `GET /rag/documents` - List uploaded documents
- `DELETE /rag/documents/{id}` - Delete document
- `POST /rag/search` - Search documents

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - MongoDB connection string
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `GROQ_API_KEY` - Groq API key for LLM

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Key Features Implementation

### RAG System
The RAG (Retrieval-Augmented Generation) system allows users to:
1. Upload PDF documents
2. Extract and embed document text using sentence-transformers
3. Store embeddings in vector database
4. Retrieve relevant documents for chat context
5. Generate responses using Groq LLM with contextual information

### Authentication
- User registration and login with secure password hashing (bcrypt)
- JWT-based authentication
- Protected API routes
- Session management in frontend

### Real-time Chat
- Send messages and receive AI responses
- View conversation history
- Manage multiple conversations
- Context-aware responses with RAG

## Development

### Code Structure
- Backend follows FastAPI best practices with modular route organization
- Frontend uses React hooks and Context API for state management
- TypeScript for type safety across the stack

### Database
MongoDB is used with Motor (async driver) for non-blocking database operations.

### Frontend Components
shadcn/ui provides pre-built, accessible components that can be customized with Tailwind CSS.

## Troubleshooting

### Virtual Environment Issues
If you encounter venv path issues, recreate it:
```bash
cd backend
rm -r venv  # or rmdir /s venv on Windows
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

### MongoDB Connection
Ensure MongoDB is running:
```bash
# If using local MongoDB
mongod
```

### Port Already in Use
Change the port in uvicorn command:
```bash
uvicorn app.main:app --reload --port 8001
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**Last Updated**: February 2026
