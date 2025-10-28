

import datetime
from typing import List, Optional, Literal, ClassVar
from pydantic import BaseModel, Field
from config import CONFIG
from models.exercises import Exercise, Exercises
from models.meals import Meal, Meals
from models.abstracts import Entity, FirestoreDoc


class Grocery(Entity):
    name: str
    isCompleted: bool = False


class Groceries(FirestoreDoc):
    collection: str = 'groceries'
    id:str="all"
    items: List[Grocery] = [
    Grocery(name="Water"),
    Grocery(name="Salmon"),
]
