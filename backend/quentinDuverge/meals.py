import datetime
from typing import List, Literal, Optional, ClassVar
from quentinDuverge.agents import meals_agent

from pydantic import BaseModel, Field

from clients.shared import get_agent_lite, get_firestore_client
from quentinDuverge.abstracts import FirestoreModel
from utils import process_output

collection = 'meals'
agent = get_agent_lite()
fs = get_firestore_client('quentin-duverge')
today = datetime.datetime.now().strftime("%Y-%m-%d")

class Ingredient(BaseModel):
    name: str
    quantity: float = Field(description="The volume in ml or weight in grams")
    calories: int

class Meal(BaseModel):
    name: str = None
    isCompleted: bool = False
    items: Optional[List[Ingredient]] = None
    instructions: Optional[str] = None
    calories: Optional[int] = None


class MealsList(BaseModel):
    items: List[Meal] = []


class Meals(FirestoreModel):
    items: List[Meal] = []
    notes: Optional[str] = None

    def buildItems(self, notes: Optional[str] = None):
        prompt = agent.prompt({
            'HISTORICAL_MEALS_DATA': fs.historics(collection, self.id),
            'USER_NOTES': notes 
        })
        output = agent.call(si=meals_agent, prompt=prompt, schema=MealsList)
        meals = process_output(output, model=MealsList)
        print(meals.model_dump())
        meals = Meals(
            id=self.id,
            notes=notes,
            items=meals.items
        )
        meals.save()
        return meals
