import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from models.users import User
from clients.shared import set_current_user, get_current_user as get_shared_current_user


# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

security = HTTPBearer()

def verify_token(token: str) -> User:
    """Verify Firebase ID token and return user data"""
    decoded_token = auth.verify_id_token(token)
    print('DECODED TOKEN', decoded_token)
    user = User(**decoded_token)
    print('user', user)
    set_current_user(user)
    return user

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    token = credentials.credentials
    user = verify_token(token)
    return user