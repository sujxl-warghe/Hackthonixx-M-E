from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.config import JWT_SECRET, ALGORITHM

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)

def create_token(email):
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=6)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)
