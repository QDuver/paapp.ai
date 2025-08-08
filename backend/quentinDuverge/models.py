
from typing import List, Optional
from pydantic import BaseModel

class ExerciseSet(BaseModel):
    weight_kg: Optional[float] = None
    repetitions: Optional[int] = None
    duration_sec: Optional[int] = None
    rest: Optional[int] = 90

class Exercise(BaseModel):
    name: str
    sets: List[ExerciseSet] = []

class ExerciseDay(BaseModel):
    day: str
    at_home: Optional[bool] = False
    wakeup_time: Optional[str] = None
    available_exercise_time: Optional[int]
    exercises: Optional[List[Exercise]] = []
    