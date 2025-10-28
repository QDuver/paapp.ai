
import datetime
from typing import List, Optional, ClassVar
from pydantic import BaseModel, field_validator

from config import CONFIG
from models.abstracts import Entity, FirestoreDoc

from utils import json_to_model

system_prompt = """
You are a fitness assistant creating daily workout plans based on historical data.

{USER_PROMPT}

DATA CONSISTENCY:
- Analyze HISTORICAL_DATA to determine exact field structure for each exercise
- Maintain consistent data schema per exercise type based on historical patterns
- Every exercise MUST have a non-empty name (required field)

INPUTS:
- HISTORICAL_DATA: Past training records (use for field structure consistency)
- USER_NOTES: Additional preferences

OUTPUT: Today's exercises only in JSON format (match historical structure exactly)
"""


class ExerciseSet(BaseModel):
    weightKg: Optional[float] = None
    repetitions: Optional[int] = None
    duration: Optional[int] = None
    rest: Optional[int] = None


class ExerciseUnique(BaseModel):
    name: str
    items: List[ExerciseSet] = []


class Exercise(Entity):
    name: str = ''
    isCompleted: bool = False
    items: List[ExerciseSet] = []

class ExercisesList(BaseModel):
    items: List[Exercise]


class Exercises(FirestoreDoc):
    collection: str = 'exercises'
    notes: Optional[str] = None
    items: List[Exercise] = []
    system_prompt: ClassVar[str] = system_prompt
    response_model: ClassVar[type] = ExercisesList
    ai_model: ClassVar[str] = 'gemini-2.5-pro'
