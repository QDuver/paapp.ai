import datetime
from typing import ClassVar, List, Literal, Literal, Optional
from quentinDuverge.agents import meals_agent

from pydantic import BaseModel, Field

from clients.shared import get_agent_lite, get_firestore_client
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


class Meals(BaseModel):
    id: str
    collection: str = collection
    items: List[Meal] = []
    notes: Optional[str] = None

    @staticmethod
    def query(id: str):
        data = fs.collection(collection).document(id).get().to_dict()
        if data is None:
            return Meals(id=id)
        return Meals(**data)

    def save(self):
        fs.collection(collection).document(self.id).set(self.model_dump(exclude_none=True))

    def build(id: str = today, notes: Optional[str] = None):
        prompt = agent.prompt({
            'HISTORICAL_MEALS_DATA': fs.historics(collection, id),
            'USER_NOTES': notes
        })
        output = agent.call(si=meals_agent, prompt=prompt, schema=MealsList)
        meals = process_output(output, model=MealsList)
        print(meals.model_dump())
        meals = Meals(
            id=id,
            notes=notes,
            items=meals.items
        )
        meals.save()
        return meals
