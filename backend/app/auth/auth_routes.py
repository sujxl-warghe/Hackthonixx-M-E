import json
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.auth.auth_utils import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Auth"])

USERS_FILE = "users.json"

def load_users_from_file():
    """Load users from local JSON file."""
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_users_to_file(users):
    """Save users to local JSON file."""
    try:
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f, indent=2)
    except:
        pass

async def find_user(email: str):
    """Try MongoDB first, fall back to file storage."""
    # Try MongoDB
    try:
        from app.database import users_collection
        user = await users_collection.find_one({"email": email})
        if user:
            return user
    except Exception as db_err:
        print(f"MongoDB error: {db_err}")
    
    # Fall back to file storage
    users = load_users_from_file()
    if email in users:
        return users[email]
    return None

async def insert_user(email: str, hashed_password: str):
    """Try MongoDB first, fall back to file storage."""
    user_doc = {"email": email, "password": hashed_password}
    
    # Try MongoDB
    try:
        from app.database import users_collection
        await users_collection.insert_one(user_doc)
        return True
    except Exception as db_err:
        print(f"MongoDB error: {db_err}")
    
    # Fall back to file storage
    users = load_users_from_file()
    users[email] = user_doc
    save_users_to_file(users)
    return True


class AuthModel(BaseModel):
    email: str
    password: str


@router.post("/register")
async def register(auth: AuthModel):
    try:
        email = auth.email.strip() if auth.email else ""
        password = auth.password.strip() if auth.password else ""
        
        if not email or not password:
            raise HTTPException(400, "Email and password required")
        
        # Check if user exists
        existing_user = await find_user(email)
        if existing_user:
            raise HTTPException(400, "User already exists")
        
        # Create new user
        hashed_pwd = hash_password(password)
        success = await insert_user(email, hashed_pwd)
        
        if not success:
            raise HTTPException(500, "Failed to save user")
        
        return {"message": "Registered successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Register error: {e}")
        raise HTTPException(500, f"Registration error: {str(e)}")


@router.post("/login")
async def login(auth: AuthModel):
    try:
        email = auth.email.strip() if auth.email else ""
        password = auth.password.strip() if auth.password else ""
        
        if not email or not password:
            raise HTTPException(400, "Email and password required")
        
        # Find user
        user = await find_user(email)
        
        if not user:
            raise HTTPException(401, "Invalid credentials")
        
        stored_password = user.get("password", "")
        if not verify_password(password, stored_password):
            raise HTTPException(401, "Invalid credentials")
        
        token = create_token(email)
        return {"access_token": token}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(500, f"Login error: {str(e)}")
