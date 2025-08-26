

import datetime
from typing import ClassVar, List, Optional, Literal, Union
from pydantic import BaseModel
from clients.shared import get_firestore_client
from quentinDuverge.exercises import Exercise, Exercises
from quentinDuverge.meals import Meal, Meals

today = datetime.datetime.now().strftime("%Y-%m-%d")
fs = get_firestore_client('quentin-duverge')
FSDB = 'routines'

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
    objects: Union[List[Exercise], Meal, List] = []


class Routines(BaseModel):
    day: str = today
    wakeupTime: Optional[str] = datetime.datetime.now().strftime("%H:%M")
    routines: List[Routine] = []

    @staticmethod
    def build_from_db(day: str = today):
        
        # Get routines document, return empty Routines if not found
        routines_data = fs.collection(FSDB).document(day).get().to_dict()
        if routines_data is None:
            routines = Routines.build()
        else:
            routines = Routines(**routines_data)
        
        # Get exercises document, return empty list if not found
        exercises_data = fs.collection('exercises').document(day).get().to_dict()
        if exercises_data is None:
            exercises = []
        else:
            exercises = Exercises(**exercises_data).exercises
        
        # Get meals document, return empty list if not found
        meals_data = fs.collection('meals').document(day).get().to_dict()
        if meals_data is None:
            meals = []
        else:
            meals = Meals(**meals_data).meals
        
        meal_index = 0
        
        for routine in routines.routines:
            if routine.routineType == 'exercises':
                routine.objects = exercises  # Assign all exercises to the exercises routine
            elif routine.routineType == 'meal' and meal_index < len(meals):
                routine.objects = meals[meal_index] if meal_index < len(meals) else None
                meal_index += 1

        return routines

    @staticmethod
    def build():
        routineBase = Routines(day=today, wakeupTime=datetime.datetime.now().strftime(
            '%H:%M'), routines=[Routine(**data) for data in ROUTINE_TEMPLATE])
        routineBase.save()
        return routineBase

    def save(self):
        fs.collection(FSDB).document(self.day).set(self.model_dump(exclude_none=True))


