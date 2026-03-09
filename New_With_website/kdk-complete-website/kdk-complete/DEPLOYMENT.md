# Production Deployment Guide

This guide covers deploying the KDK College AI Assistant to production.

## Deployment Architecture

```
┌─────────────────┐
│   Vercel/       │  ← Frontend (Next.js)
│   Netlify       │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   Railway/      │  ← Backend (FastAPI)
│   Render/       │
│   Heroku        │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│   MongoDB       │  ← Database
│   Atlas         │
└─────────────────┘
```

## Option 1: Quick Deploy (Recommended)

### Frontend: Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Framework preset: Next.js
   - Root directory: `/` (project root)
   - Build command: `npm run build`
   - Add environment variable:
     - `NEXT_PUBLIC_API_BASE`: Your backend URL (e.g., `https://your-api.railway.app`)
   - Click "Deploy"

### Backend: Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign in with GitHub

2. **Deploy Backend**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Python
   - Set root directory to `/backend`
   - Add environment variables:
     - `MONGODB_URL`: Your MongoDB Atlas connection string

3. **Configure Start Command**
   - In Railway settings, set start command:
     ```
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

### Database: MongoDB Atlas

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your users
   - Cluster name: `kdk-college-cluster`

3. **Configure Access**
   - Database Access: Create user with password
   - Network Access: Add IP `0.0.0.0/0` (allow from anywhere)

4. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kdk_college_db`

5. **Update Backend**
   - Add connection string to Railway environment variables

## Option 2: Docker Deployment

### Create Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE=http://backend:8000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URL=mongodb://mongodb:27017
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Deploy with Docker

```bash
docker-compose up -d
```

## Security Checklist

Before deploying to production, ensure:

### ✅ Backend Security

1. **Update Password Hashing**

Replace in `backend/main.py`:
```python
# Old (INSECURE):
import hashlib
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# New (SECURE):
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

Add to `requirements.txt`:
```
passlib[bcrypt]==1.7.4
```

2. **Add Rate Limiting**

```bash
pip install slowapi
```

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, login_req: LoginRequest):
    # ...
```

3. **Update CORS**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],  # Specific domain only
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

4. **Add Environment Variables**

```python
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
MONGODB_URL = os.getenv("MONGODB_URL")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
```

### ✅ Frontend Security

1. **Use HTTPS Only**

In `next.config.mjs`:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  }
}
```

2. **Environment Variables**

Never commit sensitive data. Use `.env.local`:
```
NEXT_PUBLIC_API_BASE=https://your-api-domain.com
```

### ✅ Database Security

1. **Enable Authentication**

In MongoDB Atlas:
- Enable username/password authentication
- Use strong passwords
- Restrict IP addresses

2. **Use Connection String Secrets**

Never hardcode connection strings. Use environment variables.

## Performance Optimization

### Frontend

1. **Enable Next.js Optimizations**

```javascript
// next.config.mjs
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
}
```

2. **Add CDN**

Use Vercel's Edge Network (automatic) or configure Cloudflare.

### Backend

1. **Add Caching**

```bash
pip install fastapi-cache2
```

```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache

@cache(expire=60)
async def get_cached_data():
    # ...
```

2. **Enable Gzip**

```python
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

### Database

1. **Add Indexes**

```python
# In startup event
@app.on_event("startup")
async def startup_db():
    await db.users.create_index("email", unique=True)
    await db.chats.create_index([("user_id", 1), ("timestamp", -1)])
```

2. **Connection Pooling**

```python
client = AsyncIOMotorClient(
    MONGODB_URL,
    maxPoolSize=50,
    minPoolSize=10
)
```

## Monitoring

### Add Health Check Endpoint

```python
@app.get("/health")
async def health_check():
    try:
        # Check database
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail="Service unavailable")
```

### Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/chat")
async def chat(request: ChatRequest):
    logger.info(f"Chat request from user: {request.user_id}")
    # ...
```

### Error Tracking

Use Sentry:

```bash
pip install sentry-sdk
```

```python
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0,
)
```

## Backup Strategy

### Database Backups

MongoDB Atlas provides automatic backups. Configure:
- Backup frequency: Daily
- Retention: 7 days (free tier)
- Point-in-time recovery: Optional

### Manual Backup

```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/kdk_college_db" --out=backup/
```

## Rollback Plan

1. **Keep Previous Deployment**
   - Vercel keeps deployment history
   - Railway keeps previous containers

2. **Database Migrations**
   - Test migrations locally first
   - Keep backup before migration
   - Have rollback script ready

## Post-Deployment Checklist

- [ ] Frontend accessible via HTTPS
- [ ] Backend accessible via HTTPS
- [ ] Database connection working
- [ ] User signup working
- [ ] User login working
- [ ] Chat functionality working
- [ ] File upload working
- [ ] Error monitoring active
- [ ] Backups configured
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Password hashing secure (bcrypt)
- [ ] Health check endpoint responding
- [ ] Logs being collected

## Cost Estimation (Free Tier)

- **Vercel:** Free (Hobby plan)
- **Railway:** $5/month (500 hours free trial)
- **MongoDB Atlas:** Free (M0 tier, 512MB)
- **Total:** ~$5/month (after free trials)

## Support

For deployment issues:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
