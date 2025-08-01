from datetime import date
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from clients.firestore import Firestore
from main import init_day, modify_day
from typing import Any, List

class InitDayRequest(BaseModel):
    extra_comments: Optional[str] = "None"

app = FastAPI()
fs = Firestore()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/exercises/{exercise_date}")
def exercises_by_date_endpoint(exercise_date: str):
    return fs.get(collection='routine', doc_id=exercise_date)

class UpdateFsRequest(BaseModel):
    path: List[str | int]
    value: Any

@app.post("/update-db/{collection}/{doc_id}")
def update_db_endpoint(collection: str, doc_id: str, request: UpdateFsRequest):
    fs.update(collection=collection, doc_id=doc_id, path=request.path, value=request.value)

@app.post("/init-day")
def init_day_endpoint(request: InitDayRequest):
    return init_day(request.extra_comments)

@app.get("/modify-day")
def modify_day_endpoint():
    return modify_day()
