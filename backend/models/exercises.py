
import datetime
from typing import List, Optional, ClassVar
from pydantic import BaseModel

from clients.vertex import Agent
from config import CONFIG
from models.abstracts import Entity, FirestoreDoc

from utils import json_to_model

collection = 'exercises'
today = datetime.datetime.now().strftime("%Y-%m-%d")

system_prompt = """
DATA CONSISTENCY:
- Analyze HISTORICAL_DATA to determine exact field structure for each exercise
- Maintain consistent data schema per exercise type based on historical patterns

INPUTS:
- HISTORICAL_DATA: Past training records (use for field structure consistency)
- USER_NOTES: Additional preferences

OUTPUT: Today's exercises only in JSON format (match historical structure exactly)
"""


class ExerciseSet(BaseModel):
    weightKg: Optional[float] = None
    repetitions: Optional[int] = None
    duration: Optional[int] = None
    rest: Optional[int] = None


class ExerciseUnique(BaseModel):
    name: str
    items: List[ExerciseSet] = []


class Exercise(Entity):
    name: str = ''
    isCompleted: bool = False
    items: List[ExerciseSet] = []


class ExercisesList(BaseModel):
    items: List[Exercise]


class Exercises(FirestoreDoc):
    notes: Optional[str] = None
    items: List[Exercise] = []
    generic_prompt: str = """
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

    def get_user_prompt(self) -> str:
        try:
            return CONFIG.USER_FS.collection('prompts').document('exercises').get().to_dict()['prompt']
        except TypeError:
            CONFIG.USER_FS.collection('prompts').document(
                'exercises').set({'prompt': generic_goals})
            return generic_goals

    def get_unique(self) -> List[ExerciseUnique]:
        unique_exercises = {}

        for doc in CONFIG.USER_FS.collection(collection).stream():
            doc_data = doc.to_dict()
            if not doc_data or 'items' not in doc_data:
                continue

            for exercise in doc_data['items']:
                name = exercise.get('name', '')
                if not name or (name in unique_exercises and doc.id <= unique_exercises[name]['date']):
                    continue

                latest_sets = exercise.get('items', [])
                unique_exercises[name] = {
                    'name': name, 'date': doc.id, 'items': latest_sets}

        return sorted([{'name': ex['name'], 'items': ex['items']}
                       for ex in unique_exercises.values()], key=lambda x: x['name'])

    def build_items(self, notes: Optional[str] = None):
        agent = Agent()
        prompt = agent.prompt({
            'HISTORICAL_TRAINING_DATA': self.historics(collection, self.id),
            'USER_NOTES': notes
        })
        combined_prompt = f"{self.get_user_prompt()} \n {system_prompt}"
        print('goals', combined_prompt)
        output = agent.call(si=combined_prompt, prompt=prompt,
                            model='gemini-2.5-pro', schema=ExercisesList)
        exercises_ = json_to_model(output, model=ExercisesList)
        exercises = Exercises(
            id=self.id,
            notes=notes,
            items=exercises_.items
        )
        exercises.save()
        return exercises
