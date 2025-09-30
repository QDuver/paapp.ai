
import datetime
from typing import List, Optional, ClassVar
from pydantic import BaseModel

from clients.shared import get_agent_smart, get_firestore_client
from models.abstracts import Entity, FirestoreDoc
from agents.exercises import exercise_agent

from utils import json_to_model

collection = 'exercises'
agent = get_agent_smart()
today = datetime.datetime.now().strftime("%Y-%m-%d")


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
    atHome: Optional[bool] = False
    availableTimeMin: Optional[int] = None
    notes: Optional[str] = None
    items: List[Exercise] = []
    
    
    def get_unique(self, fs) -> List[ExerciseUnique]:
        unique_exercises = {}
        
        for doc in fs.collection(collection).stream():
            doc_data = doc.to_dict()
            if not doc_data or 'items' not in doc_data:
                continue
                
            for exercise in doc_data['items']:
                name = exercise.get('name', '')
                if not name or (name in unique_exercises and doc.id <= unique_exercises[name]['date']):
                    continue
                    
                latest_sets = exercise.get('items', [])
                unique_exercises[name] = {'name': name, 'date': doc.id, 'items': latest_sets}

        return sorted([{'name': ex['name'], 'items': ex['items']}
                                       for ex in unique_exercises.values()], key=lambda x: x['name'])

    def build_items(self, fs, atHome: Optional[bool] = False, availableTimeMin: Optional[int] = None, notes: Optional[str] = None):
        prompt = agent.prompt({
            'HISTORICAL_TRAINING_DATA': self.historics(fs, collection, self.id),
            'AVAILABLE_TIME_MIN': availableTimeMin,
            'AT_HOME': atHome,
            'USER_NOTES': notes
        })
        print('prompt', prompt)
        output = agent.call( si=exercise_agent, prompt=prompt, schema=ExercisesList)
        exercises_ = json_to_model(output, model=ExercisesList)
        exercises = Exercises(
            id=self.id,
            atHome=atHome,
            availableTimeMin=availableTimeMin,
            notes=notes,
            items=exercises_.items
        )
        exercises.save(fs)
        return exercises
