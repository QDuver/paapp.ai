
import datetime
from typing import List, Optional, ClassVar
from pydantic import BaseModel

from quentinDuverge.agents import exercise_agent
from clients.shared import get_agent_smart, get_firestore_client
from quentinDuverge.abstracts import FirestoreModel

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


class Exercises(FirestoreModel):
    atHome: Optional[bool] = False
    availableTimeMin: Optional[int] = None
    notes: Optional[str] = None
    items: List[Exercise] = []


    def buildItems(self, atHome: Optional[bool] = False, availableTimeMin: Optional[int] = None, notes: Optional[str] = None):
        prompt = agent.prompt({
            'HISTORICAL_TRAINING_DATA': fs.historics(collection, self.id),
            'CONDITIONS': f'Available time in minutes : {availableTimeMin}, At home: {atHome}',
            'USER_NOTES': notes
        })
        print(prompt)
        output = agent.call( si=exercise_agent, prompt=prompt, schema=ExercisesList)
        exercises_ = process_output(output, model=ExercisesList)
        print(exercises_.model_dump())
        exercises = Exercises(
            id=self.id,
            atHome=atHome,
            availableTimeMin=availableTimeMin,
            notes=notes,
            items=exercises_.items
        )
        exercises.save()
        return exercises


