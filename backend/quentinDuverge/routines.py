

import datetime
from typing import List, Optional, Literal, ClassVar
from pydantic import BaseModel
from clients.shared import get_firestore_client
from quentinDuverge.exercises import Exercise, Exercises
from quentinDuverge.meals import Meal, Meals
from quentinDuverge.abstracts import Entity, FirestoreDoc


today = datetime.datetime.now().strftime("%Y-%m-%d")
fs = get_firestore_client('quentin-duverge')

ROUTINE_TEMPLATE = [
    {"name": "1/2L of water"},
    {"name": 'Journaling / Coding', "durationMin": 60},
    {"name": 'Exercises', "routineType": 'exercises'},
    {"name": 'Meal', "routineType": 'meals'},
    {"name": 'Running', "durationMin": 45},
    {"name": 'Meal', "routineType": 'meals'},
]


class Routine(Entity):
    name: str
    isCompleted: bool = False
    durationMin: Optional[int] = 0
    routineType: Literal['other', 'exercises', 'meals'] = 'other'
    ref: str = ''


class Routines(FirestoreDoc):
    wakeupTime: Optional[str] = datetime.datetime.now().strftime("%H:%M")
    items: List[Routine] = []

    def buildItems(self):
        self.items = [Routine(**item) for item in ROUTINE_TEMPLATE]
        print(self.items)
        self.save()