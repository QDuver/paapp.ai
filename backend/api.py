from datetime import date
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from clients.firestore import Firestore
from main import init_day, modify_day
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

@app.get("/todays-exercices")
def todays_exercises_endpoint():
    return fs.get(collection='routine', doc_id=date.today().strftime("%Y-%m-%d"))

@app.get("/init-day")
def init_day_endpoint():
    return init_day()

@app.get("/modify-day")
def modify_day_endpoint():
    return modify_day()
