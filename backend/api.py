from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google.cloud import firestore

from quentinDuverge import startDay


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
    client.collection(collection).document(document).set(request)


@app.delete("/{db}/{collection}/{document}")
def delete(db: str, collection: str, document: str, path: Optional[str] = None):
    client = firestore.Client(database=db)
    client.collection(collection).document(document).delete()


@app.post("/start-day")
def start_day(request: InitDayRequest):
    return startDay.main(request.notes)