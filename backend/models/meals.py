import datetime
from typing import List, Literal, Optional, ClassVar


from pydantic import BaseModel, Field

from clients.vertex import Agent
from config import CONFIG
from models.abstracts import Entity, FirestoreDoc
from utils import json_to_model

collection = 'meals'
today = datetime.datetime.now().strftime("%Y-%m-%d")

meals_agent = """
You are a nutrition assistant creating daily meal plans based on historical data.

OBJECTIVE: Muscle gain and belly fat reduction (not weight loss)

CONSTRAINTS:
- Only generate Lunch and Dinner (no breakfast)
- Gluten only allowed at Dinner
- Maximize ingredient diversity and nutritional balance

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
    items: List[Meal] = []
    notes: Optional[str] = None

    def build_items(self, notes: Optional[str] = None):
        agent = Agent()
        prompt = agent.prompt({
            'HISTORICAL_MEALS_DATA': self.historics(collection, self.id),
            'USER_NOTES': notes
        })
        output = agent.call(si=meals_agent, prompt=prompt, model='gemini-2.0-flash-lite-001', schema=MealsList)
        meals = json_to_model(output, model=MealsList)
        meals = Meals(
            id=self.id,
            notes=notes,
            items=meals.items
        )
        meals.save()
        return meals
