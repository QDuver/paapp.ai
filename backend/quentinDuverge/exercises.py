
import datetime
from typing import List, Optional
from pydantic import BaseModel
from quentinDuverge.agents import exercise_agent
from clients.shared import get_agent_smart, get_firestore_client, get_agent_lite

from utils import process_output

FS_COLLECTION = 'exercises'
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
    sets: List[ExerciseSet] = []


class ExerciseList(BaseModel):
    exercises: List[Exercise] = []


class Exercises(BaseModel):     
    day: str = today
    atHome: Optional[bool] = False
    availableTimeMin: Optional[int] = None
    notes: Optional[str] = None
    exercises: List[Exercise] = []

    @staticmethod
    def build(day: str = today, atHome: Optional[bool] = False, availableTimeMin: Optional[int] = None, notes: Optional[str] = None):

        prompt = agent.prompt({
            'HISTORICAL_TRAINING_DATA': fs.historics(FS_COLLECTION, day),
            'CONDITIONS': f'Available time in minutes : {availableTimeMin}, At home: {atHome}',
            'USER_NOTES': notes
        })
        print(prompt)
        output = agent.call( si=exercise_agent, prompt=prompt, schema=ExerciseList)
        exercises_ = process_output(output, model=ExerciseList)
        print(exercises_.model_dump())
        exercises = Exercises(
            day=day,
            atHome=atHome,
            availableTimeMin=availableTimeMin,
            notes=notes,
            exercises=exercises_.exercises
        )
        exercises.save()

    def save(self):
        fs.collection(FS_COLLECTION).document(self.day).set(self.model_dump(exclude_none=True))


