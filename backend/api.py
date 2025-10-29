import datetime
import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google.cloud import firestore

from config import CONFIG, PROJECT, get_all_database_names
from models.groceries import Groceries
from models.routines import Routines
from models.exercises import Exercises
from models.meals import Meals
from models.settings import Settings
from models.users import User
from models.abstracts import FirestoreDoc
from dags import router as dags_router

# Mapping of collection names to their corresponding classes
COLLECTION_CLASS_MAPPING = {
    'exercises': Exercises,
    'meals': Meals,
    'routines': Routines,
    'groceries': Groceries,
    'settings': Settings,
}


app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dags_router)

@app.get("/warmup")
def warmup_user_connection(user: User = Depends(User.from_firebase_token)):
    CONFIG.USER_FS.collection('_warmup').document('_warmup').get()
    return {}

@app.post("/build-with-ai/{collection}/{id}")
def build_with_ai(collection: str, id: str, request: dict, user: User = Depends(User.from_firebase_token)):
    instance = COLLECTION_CLASS_MAPPING[collection](id=id)
    instance = instance.build_with_ai(**request)
    return instance.model_dump()

# ALWAYS KEEP LAST ---------------

@app.get("/{collection}/{document}")
def get_document(collection: str, document: str, user: User = Depends(User.from_firebase_token)):
    return COLLECTION_CLASS_MAPPING[collection](id=document).query()

@app.post("/{collection}/{document}")
def overwrite_with_format(collection: str, document: str, request: dict, user: User = Depends(User.from_firebase_token)):
    validated_data = COLLECTION_CLASS_MAPPING[collection](**request)
    data = validated_data.model_dump()
    CONFIG.USER_FS.collection(collection).document(document).set(data)


