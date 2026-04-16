from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from typing import Optional

from database import get_db
from models import User
from schemas import UserCreate

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "professional_med_store_secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if user_data.confirm_password and user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match sequence")
    
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Identity ID already exists in mainframe")
        
    if user_data.email and db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already mapped to an existing node")
    
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=get_password_hash(user_data.password),
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    return {"message": "Protocol sequence established. Access granted."}

@router.post("/login")
def login(form_data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.get("username")).first()
    if not user or not verify_password(form_data.get("password"), user.password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": user.role, 
        "username": user.username
    }

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user
