from pydantic import BaseModel, Field, computed_field
from typing import Optional


class FirebaseIdentities(BaseModel):
    google_com: Optional[list[str]] = Field(default=None, alias="google.com")
    email: Optional[list[str]] = None


class FirebaseInfo(BaseModel):
    identities: FirebaseIdentities
    sign_in_provider: str


class User(BaseModel):
    name: str
    picture: str
    iss: str
    aud: str
    auth_time: int
    user_id: str
    sub: str
    iat: int
    exp: int
    email: str
    email_verified: bool
    firebase: FirebaseInfo
    uid: str
    
    @computed_field
    @property
    def fs_name(self) -> str:
        name_parts = self.name.split()
        initials = ''.join([part[0].lower() for part in name_parts if part])
        return f"{initials}-{self.user_id.lower()}"
    
    def get_firestore_client(self) -> 'ExtendedFirestoreClient':
        return ExtendedFirestoreClient(database=self.fs_name)