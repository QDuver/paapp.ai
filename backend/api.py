import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google.cloud import firestore

from quentinDuverge import meals, exercises
from quentinDuverge.routines import Routine, Routines
from quentinDuverge.exercises import Exercises
from quentinDuverge.meals import Meals

# Mapping of collection names to their corresponding classes
COLLECTION_CLASS_MAPPING = {
    'exercises': Exercises,
    'meals': Meals,
    'routines': Routines,
}


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


@app.get("/{db}/routines/{day}")
def get_routine(day: str):
    routines = Routines.query(id=day)
    exercises = Exercises.query(id=day)
    meals = Meals.query(id=day)
    return {"routines": routines, "exercises": exercises, "meals": meals}

@app.get("/{db}/{collection}")
def get_collection(db: str, collection: str):
    client = firestore.Client(database=db)
    documents = client.collection(collection).get()
    return [doc.to_dict() for doc in documents]

@app.get("/{db}/{collection}/{document}")
def get_document(db: str, collection: str, document: str):
    client = firestore.Client(database=db)
    doc = client.collection(collection).document(document).get()
    return doc.to_dict()

@app.post("/{db}/{collection}")
def create(db: str, collection: str, document: dict):
    client = firestore.Client(database=db)
    client.collection(collection).add(document)


@app.post("/{db}/{collection}/{document}")
def overwrite(db: str, collection: str, document: str, request: dict):
    client = firestore.Client(database=db)
    
    if collection not in COLLECTION_CLASS_MAPPING:
        raise HTTPException(status_code=400, detail=f"Collection '{collection}' not found in mapping. Available collections: {list(COLLECTION_CLASS_MAPPING.keys())}")
    
    model_class = COLLECTION_CLASS_MAPPING[collection]
    validated_data = model_class(**request)
    request = validated_data.model_dump()
    
    client.collection(collection).document(document).set(request)


@app.post("/{db}/build/{collection}/{day}")
def build_exercises(day: str, request:dict):
    Exercises.build(day=day, **request)
    return Routines.query(day=day).model_dump()


@app.delete("/{db}/{collection}/{document}")
def delete(db: str, collection: str, document: str, path: Optional[str] = None):
    client = firestore.Client(database=db)
    client.collection(collection).document(document).delete()

