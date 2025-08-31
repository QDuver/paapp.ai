
import datetime
from typing import List, Optional
from pydantic import BaseModel
from quentinDuverge.agents import exercise_agent
from clients.shared import get_agent_smart, get_firestore_client, get_agent_lite

from utils import process_output

collection = 'exercises'
agent = get_agent_smart()
fs = get_firestore_client('quentin-duverge')
today = datetime.datetime.now().strftime("%Y-%m-%d")

class ExerciseSet(BaseModel):
    weightKg: Optional[float] = None
    repetitions: Optional[int] = None
    duration: Optional[int] = None
    rest: Optional[int] = 90


class Exercise(BaseModel):
    name: str
    isCompleted: bool = False
    items: List[ExerciseSet] = []


class ExercisesList(BaseModel):
    items: List[Exercise]


class Exercises(BaseModel):     
    collection: str = collection
    id: str = today
    atHome: Optional[bool] = False
    availableTimeMin: Optional[int] = None
    notes: Optional[str] = None
    items: List[Exercise] = []
    
    
    @staticmethod
    def query(id: str = today):
        data = fs.collection(collection).document(id).get().to_dict()
        if data is None:
            return Exercises(id=id)
        return Exercises(**data)

    @staticmethod
    def build(id: str = today, atHome: Optional[bool] = False, availableTimeMin: Optional[int] = None, notes: Optional[str] = None):

        prompt = agent.prompt({
            'HISTORICAL_TRAINING_DATA': fs.historics(collection, id),
            'CONDITIONS': f'Available time in minutes : {availableTimeMin}, At home: {atHome}',
            'USER_NOTES': notes
        })
        print(prompt)
        output = agent.call( si=exercise_agent, prompt=prompt, schema=ExercisesList)
        exercises_ = process_output(output, model=ExercisesList)
        print(exercises_.model_dump())
        exercises = Exercises(
            id=id,
            atHome=atHome,
            availableTimeMin=availableTimeMin,
            notes=notes,
            items=exercises_.items
        )
        exercises.save()
        return exercises

    def save(self):
        fs.collection(collection).document(self.id).set(self.model_dump(exclude_none=True))


