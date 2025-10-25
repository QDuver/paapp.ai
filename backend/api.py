import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google.cloud import firestore

from config import CONFIG, get_all_database_names, PROJECT
from models import meals, exercises
from models.routines import Routine, Routines
from models.exercises import Exercises
from models.meals import Meals
from models.settings import Settings
from models.users import User
import time


# Mapping of collection names to their corresponding classes
COLLECTION_CLASS_MAPPING = {
    'exercises': Exercises,
    'meals': Meals,
    'routines': Routines,
    'settings': Settings,
}


def get_model_class(collection: str):
    if collection not in COLLECTION_CLASS_MAPPING:
        raise HTTPException(
            status_code=400, detail=f"Collection '{collection}' not found in mapping. Available collections: {list(COLLECTION_CLASS_MAPPING.keys())}")
    return COLLECTION_CLASS_MAPPING[collection]


class InitDayRequest(BaseModel):
    notes: Optional[str] = "None"


class ScheduleExercisesRequest(BaseModel):
    user_id: str
    name: str
    notes: Optional[str] = None


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
    CONFIG.USER_FS.collection('_warmup').document('_warmup').get()
    return {}

@app.get("/unique/{collection}")
def get_document(collection: str, user: User = Depends(User.from_firebase_token)):
    return get_model_class(collection)().get_unique()
    

@app.get("/{collection}/{document}")
def get_document(collection: str, document: str, user: User = Depends(User.from_firebase_token)):
    return get_model_class(collection)(id=document).query()

@app.post("/{collection}/{document}")
def overwrite_with_format(collection: str, document: str, request: dict, user: User = Depends(User.from_firebase_token)):
    model_class = get_model_class(collection)
    validated_data = model_class(**request)
    data = validated_data.model_dump()
    CONFIG.USER_FS.collection(collection).document(document).set(data)


@app.post("/build-with-ai/{collection}/{id}")
def build_with_ai(collection: str, id: str, request: dict, user: User = Depends(User.from_firebase_token)):
    model_class = get_model_class(collection)
    instance = model_class(id=id)
    instance = instance.build_with_ai(**request)
    return instance.model_dump()

@app.post("/schedule/exercises/{date}")
def schedule_exercises( date: str, request: dict ):
    database_names = get_all_database_names()
    print('All Firestore databases:', database_names)

    results = []
    for db_name in database_names:
        print(f'Building exercises for user database: {db_name}')
        CONFIG.USER_FS = firestore.Client(project=PROJECT, database=db_name)

        instance = Exercises(id=date)
        build_params = {"notes": request.get("notes")} if request.get("notes") else {}
        instance = instance.build_with_ai(**build_params)

        results.append({
            "database": db_name,
            "exercises": instance.model_dump()
        })

    return {"scheduled": len(results), "results": results}
