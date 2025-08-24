

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
        
        routines = Routines( **fs.collection(FSDB).document(day).get().to_dict())
        exercises = Exercises(**fs.collection('exercises').document(day).get().to_dict()).exercises
        meals = Meals(**fs.collection('meals').document(day).get().to_dict()).meals
        
        meal_index = 0
        
        for routine in routines.routines:
            if routine.routineType == 'exercises':
                routine.objects = exercises  # Assign all exercises to the exercises routine
            elif routine.routineType == 'meal' and meal_index < len(meals):
                routine.objects = meals[meal_index] if meal_index < len(meals) else None
                meal_index += 1

        return routines

    @staticmethod
    def build_base():
        routineBase = Routines(day=today, wakeupTime=datetime.datetime.now().strftime(
            '%H:%M'), routines=[Routine(**data) for data in ROUTINE_TEMPLATE])
        routineBase.save()
        return routineBase


    def build_exercises(self):
        routineExercises = [ r for r in self.routines if r.routineType == 'exercises']
        [Exercises(day=self.day, availableTimeMin=30).build() for _ in routineExercises]

    def build_meals(self):
        routineMeals = [ r for r in self.routines if r.routineType == 'meal']
        [Meals(day=self.day).build() for _ in routineMeals]
        
    def save(self):
        fs.collection(FSDB).document(self.day).set(self.model_dump(exclude_none=True))


