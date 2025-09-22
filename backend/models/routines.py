

import datetime
from typing import List, Optional, Literal, ClassVar
from pydantic import BaseModel
from clients.shared import get_firestore_client
from models.exercises import Exercise, Exercises
from models.meals import Meal, Meals
from models.abstracts import Entity, FirestoreDoc


today = datetime.datetime.now().strftime("%Y-%m-%d")
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

    def build_items(self, fs):
        self.items = [Routine(**item) for item in ROUTINE_TEMPLATE]
        self.save(fs)