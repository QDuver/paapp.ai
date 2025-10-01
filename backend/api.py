import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google.cloud import firestore

from config import CONFIG
from models import meals, exercises
from models.routines import Routine, Routines
from models.exercises import Exercises
from models.meals import Meals
from models.users import User
import time


# Mapping of collection names to their corresponding classes
COLLECTION_CLASS_MAPPING = {
    'exercises': Exercises,
    'meals': Meals,
    'routines': Routines,
}


def get_model_class(collection: str):
    if collection not in COLLECTION_CLASS_MAPPING:
        raise HTTPException(
            status_code=400, detail=f"Collection '{collection}' not found in mapping. Available collections: {list(COLLECTION_CLASS_MAPPING.keys())}")
    return COLLECTION_CLASS_MAPPING[collection]


class InitDayRequest(BaseModel):
    notes: Optional[str] = "None"


app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/warmup")
def warmup_user_connection(user: User = Depends(User.from_firebase_token)):
    start_time = time.time()
    CONFIG.USER_FS.collection('_warmup').document('_warmup').get()
    elapsed = time.time() - start_time
    return {"status": "warm", "time": elapsed}


@app.get("/routines/{day}")
def get_routine(day: str, user: User = Depends(User.from_firebase_token)):
    routines = Routines(id=day).query()
    exercises = Exercises(id=day).query()
    uniqueExercises = exercises.get_unique()
    meals = Meals(id=day).query()
    return {"routines": routines, "exercises": exercises, "uniqueExercises": uniqueExercises, "meals": meals}

@app.get("/{collection}/{document}")
def get_document(collection: str, document: str, user: User = Depends(User.from_firebase_token)):
    return CONFIG.USER_FS.collection(collection).document(document).get().to_dict() 

@app.post("/{collection}/{document}")
def overwrite(collection: str, document: str, request: dict, user: User = Depends(User.from_firebase_token)):
    CONFIG.USER_FS.collection(collection).document(document).set(request)
    return {"status": "success"}

@app.post("format/{collection}/{document}")
def overwrite_with_format(collection: str, document: str, request: dict, user: User = Depends(User.from_firebase_token)):
    model_class = get_model_class(collection)
    validated_data = model_class(**request)
    data = validated_data.model_dump()
    CONFIG.USER_FS.collection(collection).document(document).set(data)


@app.post("/build-items/{collection}/{id}")
def build_items(collection: str, id: str, request: dict, user: User = Depends(User.from_firebase_token)):
    model_class = get_model_class(collection)
    instance = model_class(id=id)
    instance = instance.build_items(**request)
    return instance.model_dump()
