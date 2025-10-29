from pydantic import BaseModel, Field, computed_field
from typing import Optional
import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Depends, HTTPException, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import CONFIG
import os
from clients.firestore import FirestoreClient
if not firebase_admin._apps:
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)

security = HTTPBearer()


class FirebaseIdentities(BaseModel):
    google_com: Optional[list[str]] = Field(default=None, alias="google.com")
    email: Optional[list[str]] = None


class FirebaseInfo(BaseModel):
    identities: FirebaseIdentities
    sign_in_provider: str


class User(BaseModel):
    name: str
    user_id: str
    picture: Optional[str] = None
    iss: Optional[str] = None
    aud: Optional[str] = None
    auth_time: Optional[int] = None
    sub: Optional[str] = None
    iat: Optional[int] = None
    exp: Optional[int] = None
    email: Optional[str] = None
    email_verified: Optional[bool] = None
    firebase: Optional[FirebaseInfo] = None
    uid: Optional[str] = None

    @classmethod
    def from_firebase_token(cls, credentials: HTTPAuthorizationCredentials = Depends(security)) -> "User":
        decoded_token = auth.verify_id_token(credentials.credentials)
        user = cls(**decoded_token)
        CONFIG.user = user
        CONFIG.USER_FS = FirestoreClient().find_db_by_user(user)
        return user
