from typing import List, Optional
from pydantic import BaseModel
from models.abstracts import FirestoreDoc

exercises_prompt = """
GOALS:
2. Athletic physique with visible muscles (arms, shoulders, chest, abs)
3. Improve posture and reduce back pain
4. Reduce belly fat

TRAINING CYCLE (repeat):
- Day 1: Upper-Body Strength + Core
- Day 2: Lower Body Strength + Upper-Body Hypertrophy  
- Day 3: Back and Core

PROGRAMMING RULES:
- Progressive overload over time
"""

meals_prompt: str = """
GOALS:
1. Muscle gain and belly fat reduction (not weight loss)
2. High protein, moderate carbs, low fat
3. Maximize ingredient diversity and nutritional balance

DIETARY RESTRICTIONS:
- No pork or shellfish
- Gluten only allowed at Dinner    
"""


class Module(BaseModel):
    enabled: bool = True
    prompt: Optional[str] = None

class Settings(FirestoreDoc):
    id:str = 'settings'
    collection:str = 'settings'
    routines: Module = Module(enabled=True)
    exercises: Module = Module(enabled=True, prompt=exercises_prompt)
    meals: Module = Module(enabled=True, prompt=meals_prompt)
