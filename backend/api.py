import datetime
import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google.cloud import firestore

from config import CONFIG, PROJECT, get_all_database_names
from models.routines import Routines
from models.exercises import Exercises
from models.meals import Meals
from models.settings import Settings
from models.users import User
from models.abstracts import FirestoreDoc

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

@app.post("/build-with-ai/{collection}/{id}")
def build_with_ai(collection: str, id: str, request: dict, user: User = Depends(User.from_firebase_token)):
    model_class = get_model_class(collection)
    instance = model_class(id=id)
    instance = instance.build_with_ai(**request)
    return instance.model_dump()


# DAGS ----------------

@app.get("/delete-incomplete")
def delete_incomplete():
    for db_name in get_all_database_names():
        CONFIG.USER_FS = firestore.Client(project=PROJECT, database=db_name)
        for collection in ['exercises', 'meals']:
            docs = CONFIG.USER_FS.collection(collection).stream()
            for doc in docs:
                if doc.id == CONFIG.today:
                    continue
                data = doc.to_dict()
                if 'items' in data and isinstance(data['items'], list):
                    data['items'] = [item for item in data['items'] if item.get('isCompleted') != False]
                    if len(data['items']) == 0:
                        doc.reference.delete()
                    else:
                        doc.reference.set(data)

    return {}

@app.get("/schedule")
def schedule_day():
    for db_name in get_all_database_names():
        CONFIG.USER_FS = firestore.Client(project=PROJECT, database=db_name)
        for collection in ['exercises', 'meals']:
            instance = get_model_class(collection)()
            instance.build_with_ai()

    return {}
    

@app.get("/uniques")
def uniques():
    for db_name in get_all_database_names():
        CONFIG.USER_FS = firestore.Client(project=PROJECT, database=db_name)
        for collection in ['meals', 'routines', 'exercises']:
            unique_items = get_model_class(collection)().get_unique()
            CONFIG.USER_FS.collection(collection).document('uniques').set({'uniques': unique_items})

    return {}

# ----------------------------





# ALWAYS KEEP LAST ---------------

@app.get("/{collection}/{document}")
def get_document(collection: str, document: str, user: User = Depends(User.from_firebase_token)):
    return get_model_class(collection)(id=document).query()

@app.post("/{collection}/{document}")
def overwrite_with_format(collection: str, document: str, request: dict, user: User = Depends(User.from_firebase_token)):
    model_class = get_model_class(collection)
    validated_data = model_class(**request)
    data = validated_data.model_dump()
    CONFIG.USER_FS.collection(collection).document(document).set(data)


