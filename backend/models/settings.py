from typing import List, Optional
from pydantic import BaseModel
from models.abstracts import FirestoreDoc
from models.exercises import default_prompt as exercises_default_prompt
from models.meals import default_prompt as meals_default_prompt



class Module(BaseModel):
    enabled: bool = True
    prompt: Optional[str] = None

class Settings(FirestoreDoc):
    id:str = 'settings'
    collection:str = 'settings'
    routines: Module = Module(enabled=True)
    exercises: Module = Module(enabled=True, prompt=exercises_default_prompt)
    meals: Module = Module(enabled=True, prompt=meals_default_prompt)
