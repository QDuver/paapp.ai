

import datetime
from typing import List, Optional, Literal, ClassVar
from pydantic import BaseModel
from config import CONFIG
from models.exercises import Exercise, Exercises
from models.meals import Meal, Meals
from models.abstracts import Entity, FirestoreDoc


today = datetime.datetime.now().strftime("%Y-%m-%d")

class Routine(Entity):
    name: str
    isCompleted: bool = False
    durationMin: Optional[int] = 0
    routineType: Literal['other', 'exercises', 'meals'] = 'other'
    ref: str = ''


class Routines(FirestoreDoc):
    collection: str = 'routines'
    wakeupTime: Optional[str] = datetime.datetime.now().strftime("%H:%M")
    items: List[Routine] = [
    Routine(name="1/2L of water"),
    Routine(name='Journaling / Coding', durationMin=60),
    Routine(name='Exercises', routineType='exercises'),
    Routine(name='Meal', routineType='meals'),
    Routine(name='Running', durationMin=45),
    Routine(name='Meal', routineType='meals'),
]