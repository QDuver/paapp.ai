from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from clients.db import Database
from clients.firestore import Firestore
from typing import Any, List

class InitDayRequest(BaseModel):
    extra_comments: Optional[str] = "None"

app = FastAPI()
fs = Firestore(database='quentin-duverge')
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/exercises")
def exercises_endpoint():
    db = Database(db_path="quentinDuverge/database.db")
    result = db.query('SELECT * FROM exercise_sets JOIN exercises ON exercise_sets.exercise_id = exercises.id JOIN exercise_days ON exercises.exercise_day_id = exercise_days.id')
    return result['data']


# @app.post("/init-day")
# def init_day_endpoint(request: InitDayRequest):
#     return init_day(request.extra_comments)
