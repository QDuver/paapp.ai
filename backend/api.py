import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google.cloud import firestore

from clients.shared import get_firestore_client
from models import meals, exercises
from models.routines import Routine, Routines
from models.exercises import Exercises
from models.meals import Meals
from models.users import User

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


@app.get("/routines/{day}")
def get_routine(day: str, user: User = Depends(User.from_firebase_token)):
    fs = get_firestore_client()
    routines = Routines(id=day).query(fs)
    exercises = Exercises(id=day).query(fs)
    uniqueExercises = exercises.get_unique(fs)
    meals = Meals(id=day).query(fs)
    return {"routines": routines, "exercises": exercises, "uniqueExercises": uniqueExercises, "meals": meals}


@app.post("/{collection}/{document}")
def overwrite(collection: str, document: str, request: dict, user: User = Depends(User.from_firebase_token)):

    model_class = get_model_class(collection)
    validated_data = model_class(**request)
    data = validated_data.model_dump()

    fs = get_firestore_client()
    fs.collection(collection).document(document).set(data)


@app.post("/build-items/{collection}/{id}")
def build_items(collection: str, id: str, request: dict, user: User = Depends(User.from_firebase_token)):

    model_class = get_model_class(collection)
    
    fs = get_firestore_client()
    instance = model_class(id=id)
    instance = instance.build_items(fs, **request)
    return instance.model_dump()
