
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class Meal(BaseModel):
    day: str = None
    name: str = None
    ingredients: List[str] = None
    instructions: str = None
    calories: int = None
    meal_type: Literal["breakfast", "lunch", "dinner"] = None

class ProcessedComment(BaseModel):
    training: Optional[str] = None
    nutrition: Optional[str] = None

class Routine(BaseModel):
    name: str
    isCompleted: bool = False

class ExerciseSet(BaseModel):
    weightKg: Optional[float] = None
    repetitions: Optional[int] = None
    duration: Optional[int] = None
    rest: Optional[int] = 90

class Exercise(BaseModel):
    name: str
    isCompleted: bool = False
    sets: List[ExerciseSet] = []

class ExerciseDay(BaseModel):
    day: str
    atHome: Optional[bool] = False
    wakeupTime: Optional[str] = None
    availableExerciseTime: Optional[int]
    exercises: Optional[List[Exercise]] = []
    