# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### Problem: npm install fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clear npm cache**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Use legacy peer deps**
```bash
npm install --legacy-peer-deps
```

3. **Update Node.js**
```bash
# Check version
node --version

# Should be 18.0 or higher
# Download from https://nodejs.org
```

### Problem: pip install fails

**Error:**
```
error: Microsoft Visual C++ 14.0 or greater is required
```

**Solution (Windows):**
- Install Visual Studio Build Tools
- Or install package via conda: `conda install -c conda-forge <package>`

**Error (macOS):**
```
error: command 'clang' failed
```

**Solution:**
```bash
xcode-select --install
```

## MongoDB Issues

### Problem: Can't connect to MongoDB

**Error:**
```
pymongo.errors.ServerSelectionTimeoutError: localhost:27017: [Errno 61] Connection refused
```

**Solutions:**

1. **Check if MongoDB is running**
```bash
# macOS
brew services list

# Linux
sudo systemctl status mongodb

# Docker
docker ps | grep mongo
```

2. **Start MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Docker
docker start mongodb
```

3. **Check MongoDB port**
```bash
mongosh
```

If it connects, MongoDB is running correctly.

### Problem: MongoDB authentication failed

**Error:**
```
Authentication failed
```

**Solution:**

If using MongoDB Atlas:
1. Check username/password are correct
2. Check IP whitelist includes your IP (or use 0.0.0.0/0 for testing)
3. Update connection string in `backend/.env`

### Problem: Database not found

**Solution:**

MongoDB creates databases automatically. Just use it:
```python
db = client.kdk_college_db  # Creates if doesn't exist
```

## Runtime Issues

### Problem: Port already in use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Find and kill the process**
```bash
# macOS/Linux - Port 3000
lsof -ti:3000 | xargs kill -9

# macOS/Linux - Port 8000
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **Change the port**

Edit `package.json`:
```json
"dev:frontend": "next dev -p 3001"
```

### Problem: CORS errors in browser

**Error:**
```
Access to fetch at 'http://127.0.0.1:8000/chat' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**

Check `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Make sure this is here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Problem: API requests fail

**Error in browser console:**
```
Failed to fetch
```

**Solutions:**

1. **Check backend is running**
   - Visit http://127.0.0.1:8000/docs
   - Should show FastAPI documentation

2. **Check API base URL**

In `lib/api.ts`:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
```

3. **Check network tab**
   - Open DevTools (F12)
   - Network tab
   - Look for failed requests
   - Check response details

### Problem: User not logged in after signup/login

**Solution:**

Check browser console and localStorage:
1. Open DevTools (F12)
2. Application tab → Local Storage → http://localhost:3000
3. Should see `kdk_user` key with value like: `{"id":"...", "email":"..."}`

If missing, check:
- Network tab shows successful /auth/login or /auth/signup response
- Response contains `id` and `email` fields
- `setUser()` is being called in `AuthContext.tsx`

### Problem: Chat messages not working

**Symptoms:**
- Message sent but no response
- Error in console

**Solutions:**

1. **Check backend logs**

Look for errors in the terminal running the backend.

2. **Test backend directly**

Visit http://127.0.0.1:8000/docs and test the `/chat` endpoint:
```json
{
  "message": "Hello",
  "user_id": null
}
```

3. **Check ChatContext**

In browser DevTools console:
```javascript
localStorage.getItem('kdk_user')
```

Should return user object.

## Build Issues

### Problem: Next.js build fails

**Error:**
```
Type error: Cannot find module '@/lib/api'
```

**Solution:**

1. **Check tsconfig.json**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

2. **Restart TypeScript server**

In VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

### Problem: Missing dependencies

**Error:**
```
Module not found: Can't resolve 'lucide-react'
```

**Solution:**
```bash
npm install
```

If still failing:
```bash
npm install lucide-react --save
```

## Frontend Issues

### Problem: Styles not loading

**Symptoms:**
- No styling applied
- Plain HTML visible

**Solutions:**

1. **Check Tailwind is installed**
```bash
npm list tailwindcss
```

2. **Check globals.css is imported**

In `app/layout.tsx`:
```typescript
import '@/app/globals.css'
```

3. **Restart dev server**
```bash
# Ctrl+C to stop
npm run dev
```

### Problem: Images not loading

**Error:**
```
Error: Invalid src prop
```

**Solution:**

Make sure images are in the `public` folder:
```
public/
  └── kdk-logo.png
```

Reference as:
```tsx
<Image src="/kdk-logo.png" alt="Logo" width={80} height={80} />
```

### Problem: Routing not working

**Symptoms:**
- 404 on /signup or /chat

**Solution:**

Check folder structure:
```
app/
  ├── signup/
  │   └── page.tsx
  ├── login/
  │   └── page.tsx
  └── chat/
      └── page.tsx
```

Each route needs a `page.tsx` file.

## Backend Issues

### Problem: Import errors

**Error:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

Or with virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Problem: Pydantic validation error

**Error:**
```
ValidationError: 1 validation error for SignupRequest
```

**Solution:**

Check request body matches model:
```python
class SignupRequest(BaseModel):
    email: EmailStr  # Must be valid email
    password: str    # Required field
```

### Problem: MongoDB ObjectId error

**Error:**
```
bson.errors.InvalidId: 'abc' is not a valid ObjectId
```

**Solution:**

Validate ObjectId before querying:
```python
from bson import ObjectId
from bson.errors import InvalidId

try:
    user_id = ObjectId(user_id_str)
    user = await db.users.find_one({"_id": user_id})
except InvalidId:
    raise HTTPException(status_code=400, detail="Invalid user ID")
```

## Common User Errors

### Problem: Can't signup with personal email

**Error:**
"Please use your college email address"

**Solution:**

Use email ending in `@kdk.edu` or `@kdkce.edu.in`

To allow other emails, edit `app/signup/page.tsx`:
```typescript
// Remove or modify this validation:
if (!email.endsWith('@kdk.edu') && !email.endsWith('@kdkce.edu.in')) {
  // ...
}
```

### Problem: Password too short

**Error:**
"Password must be at least 6 characters"

**Solution:**

Use a password with 6+ characters. To change requirement, edit `app/signup/page.tsx`:
```typescript
if (password.length < 6) {  // Change this number
  setError('Password must be at least 6 characters')
  return
}
```

## Performance Issues

### Problem: Slow response times

**Solutions:**

1. **Add database indexes**

```python
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.chats.create_index([("user_id", 1), ("timestamp", -1)])
```

2. **Enable MongoDB connection pooling**

```python
client = AsyncIOMotorClient(
    MONGODB_URL,
    maxPoolSize=50,
    minPoolSize=10
)
```

3. **Add caching**

For repeated queries, use Redis or in-memory cache.

### Problem: High memory usage

**Solution:**

Limit page size for queries:
```python
messages = await db.chats.find({"user_id": user_id}).limit(50).to_list(length=50)
```

## Getting More Help

### Enable Debug Mode

**Frontend:**

Check browser console (F12) for detailed error messages.

**Backend:**

Add logging:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Check Logs

**Frontend:**
```bash
# Check Next.js logs in terminal
```

**Backend:**
```bash
# Check uvicorn logs in terminal
```

**MongoDB:**
```bash
# View MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log  # macOS
tail -f /var/log/mongodb/mongod.log           # Linux
```

### Test Components Separately

1. **Test MongoDB:**
```bash
mongosh
use kdk_college_db
db.users.find()
```

2. **Test Backend:**
```bash
curl http://127.0.0.1:8000/
```

3. **Test Frontend:**
```bash
curl http://localhost:3000
```

## Still Having Issues?

1. Check all services are running:
   - MongoDB: `mongosh` should connect
   - Backend: http://127.0.0.1:8000/docs should load
   - Frontend: http://localhost:3000 should load

2. Check environment variables are set correctly

3. Check file permissions (especially on Linux/macOS)

4. Try a fresh install:
```bash
rm -rf node_modules backend/venv
npm install
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

5. Check GitHub issues or create a new one with:
   - Error message (full stack trace)
   - What you were trying to do
   - What you've already tried
   - Your OS and versions (Node, Python, MongoDB)
