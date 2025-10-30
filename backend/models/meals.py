import datetime
from typing import List, Literal, Optional, ClassVar


from pydantic import BaseModel, Field

from config import CONFIG
from models.abstracts import Entity, FirestoreDoc
from utils import json_to_model

default_prompt: str = """
- Support overall health and fitness objectives
- Only two meals a day
- Loose weight while preserving muscle mass
- Emphasize whole, minimally processed foods
- No red meats
- No sugary snacks

"""

system_prompt = """
You are a nutrition assistant creating daily meal plans based on historical data and user's objectives.

USER OBJECTIVES:
{USER_PROMPT}


INPUTS:
- HISTORICAL_DATA: Past records. Should be used to ensure diversity and consistency in meal structure
- USER_NOTES: Additional preferences for that specific day

OUTPUT: Meals in JSON format matching historical data structure
"""


class Ingredient(BaseModel):
    name: str
    quantity: float = Field(description="The volume in ml or weight in grams")
    calories: int

class Meal(Entity):
    isCompleted: bool = False
    instructions: str = None
    calories: int = None
    items: Optional[List[Ingredient]] = None
class MealsList(BaseModel):
    items: List[Meal] = []
class Meals(FirestoreDoc):
    collection: str = 'meals'
    items: List[Meal] = []
    notes: Optional[str] = None
    system_prompt: ClassVar[str] = system_prompt
    response_model: ClassVar[type] = MealsList
    ai_model: ClassVar[str] = 'gemini-2.0-flash-lite-001'
