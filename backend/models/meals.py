import datetime
from typing import List, Literal, Optional, ClassVar
from agents.meals import meals_agent


from pydantic import BaseModel, Field

from clients.shared import get_agent_lite
from models.abstracts import Entity, FirestoreDoc
from utils import json_to_model

collection = 'meals'
agent = get_agent_lite()
today = datetime.datetime.now().strftime("%Y-%m-%d")

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

    def build_items(self, fs, notes: Optional[str] = None):
        prompt = agent.prompt({
            'HISTORICAL_MEALS_DATA': fs.historics(collection, self.id),
            'USER_NOTES': notes 
        })
        output = agent.call(si=meals_agent, prompt=prompt, schema=MealsList)
        meals = json_to_model(output, model=MealsList)
        meals = Meals(
            id=self.id,
            notes=notes,
            items=meals.items
        )
        meals.save(fs)
        return meals
