
import datetime
from typing import List, Optional
from pydantic import BaseModel
from quentinDuverge.agents import exercise_agent
from clients.shared import get_firestore_client, get_agent_lite

from utils import process_output

FS_COLLECTION = 'exercises'
agent = get_agent_lite()
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
    sets: List[ExerciseSet] = []


class ExerciseList(BaseModel):
    exercises: List[Exercise] = []


class Exercises(BaseModel):     
    day: str = today
    atHome: Optional[bool] = False
    availableTimeMin: Optional[int] = None
    notes: Optional[str] = None
    exercises: List[Exercise] = []


    def save(self):
        fs.collection(FS_COLLECTION).document(self.day).set(self.exercises.model_dump(exclude_none=True))

    def build(self):

        prompt = agent.prompt({
            'HISTORICAL_TRAINING_DATA': fs.historics(FS_COLLECTION, self.day),
            'CONDITIONS': f'Available time in minutes : {self.availableTimeMin}, At home: {self.atHome}',
            'USER_NOTES': self.notes
        })
        print(prompt)
        output = agent.call( si=exercise_agent, prompt=prompt, schema=ExerciseList)
        self.exercises = process_output(output, model=ExerciseList)
        self.save()

