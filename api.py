from pydantic import BaseModel, Field
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from main import call_agent, call_agent_mock
app = FastAPI()


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return call_agent()


# uvicorn api:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    pass