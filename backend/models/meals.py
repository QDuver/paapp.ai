import datetime
from typing import List, Literal, Optional, ClassVar


from pydantic import BaseModel, Field

from config import CONFIG
from models.abstracts import Entity, FirestoreDoc
from utils import json_to_model

system_prompt = """
You are a nutrition assistant creating daily meal plans based on historical data.

{USER_PROMPT}

OBJECTIVE: Muscle gain and belly fat reduction (not weight loss)

CONSTRAINTS:
- Only generate Lunch and Dinner (no breakfast)
- Gluten only allowed at Dinner
- Maximize ingredient diversity and nutritional balance

INPUTS:
- HISTORICAL_DATA: Past training records (use for field structure consistency)
- USER_NOTES: Additional preferences

OUTPUT: Two meals in JSON format matching historical data structure
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
