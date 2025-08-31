from typing import ClassVar, List, Literal, Literal, Optional
from quentinDuverge.agents import meals_agent

from pydantic import BaseModel

from clients.shared import get_agent_lite, get_firestore_client
from utils import process_output

collection = 'meals'
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
    id: str
    collection: str = collection
    items: List[Meal] = []
    notes: Optional[str] = None

    @staticmethod
    def query(day: str):
        data = fs.collection(FSDB).document(day).get().to_dict()
        if data is None:
            return Meals(day=day)
        return Meals(**data)

    def save(self):
        fs.collection(FSDB).document(self.day).set(self.model_dump())

    def build(self):
        prompt = agent.prompt({
            'HISTORICAL_MEALS_DATA': fs.historics(FSDB, self.day),
            'USER_NOTES': self.notes
        })
        output = agent.call(si=meals_agent, prompt=prompt, schema=MealsList)
        self.meals = process_output(output, model=MealsList).meals
        print('self', self)
        self.save()
