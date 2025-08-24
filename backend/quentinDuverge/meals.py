from typing import ClassVar, List, Literal, Literal, Optional
from quentinDuverge.agents import meals_agent

from pydantic import BaseModel

from clients.shared import get_agent_lite, get_firestore_client
from utils import process_output

FS_COLLECTION = 'meals'
agent = get_agent_lite()
fs = get_firestore_client('quentin-duverge')


class Meal(BaseModel):
    name: str = None
    isCompleted: bool = False
    ingredients: Optional[List[str]] = None
    instructions: Optional[str] = None
    calories: Optional[int] = None


class MealsList(BaseModel):
    meals: List[Meal] = []


class Meals(BaseModel):
    day: str
    meals: List[Meal] = []
    notes: Optional[str] = None

    def save(self):
        fs.collection(FS_COLLECTION).document(self.day).set(self.model_dump())

    def build(self):
        prompt = agent.prompt({
            'HISTORICAL_MEALS_DATA': fs.historics(FS_COLLECTION, self.day),
            'USER_NOTES': self.notes
        })
        output = agent.call(si=meals_agent, prompt=prompt, schema=MealsList)
        self.meals = process_output(output, model=MealsList).meals
        print('self', self)
        self.save()
