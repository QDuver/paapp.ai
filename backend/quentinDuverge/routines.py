

import datetime
from typing import ClassVar, List, Optional, Literal, Union
from pydantic import BaseModel
from clients.shared import get_firestore_client
from quentinDuverge.exercises import Exercise, Exercises
from quentinDuverge.meals import Meal, Meals

today = datetime.datetime.now().strftime("%Y-%m-%d")
fs = get_firestore_client('quentin-duverge')
collection = 'routines'

ROUTINE_TEMPLATE = [
    {"name": "1/2L of water"},
    {"name": 'Journaling / Coding', "durationMin": 60},
    {"name": 'Exercises', "routineType": 'exercises'},
    {"name": 'Meal', "routineType": 'meal'},
    {"name": 'Running', "durationMin": 45},
    {"name": 'Meal', "routineType": 'meal'},
]


class Routine(BaseModel):
    name: str
    isCompleted: bool = False
    durationMin: Optional[int] = 0
    routineType: Literal['other', 'exercises', 'meal'] = 'other'
    ref: str = ''


class Routines(BaseModel):
    collection: str = collection
    id: str
    wakeupTime: Optional[str] = datetime.datetime.now().strftime("%H:%M")
    items: List[Routine] = []

    @staticmethod
    def query(id: str = today):

        data = fs.collection(collection).document(id).get().to_dict()
        if data is None:
            return Routines.build()
        return Routines(**data)

    @staticmethod
    def build():
        routineBase = Routines(id=today, wakeupTime=datetime.datetime.now().strftime(
            '%H:%M'), items=[Routine(**data) for data in ROUTINE_TEMPLATE])
        routineBase.save()
        return routineBase

    def save(self):
        fs.collection(collection).document(self.id).set(self.model_dump(exclude_none=True))


