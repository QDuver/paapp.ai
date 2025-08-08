

import json
from datetime import date
import requests
from agents import agent
from clients.firestore import Firestore
from clients.vertex import Vertex
from quentinDuverge.models import ExerciseDay

vertex = Vertex()
fs = Firestore('quentin-duverge')

def process_output(output):
    output_data = json.loads(output)
    if isinstance(output_data, list) and len(output_data) > 0:
        return ExerciseDay(**output_data[0])
    else:
        return ExerciseDay(**output_data)


def main(extra_comments="None"):

    WAKEUP_TIME = "09:00"
    AVAILABLE_EXERCISE_TIME = 60
    AT_HOME = False
    exerciseDay = ExerciseDay(
        day=date.today().strftime("%Y-%m-%d"),
        wakeup_time=WAKEUP_TIME,
        available_exercise_time=AVAILABLE_EXERCISE_TIME,
        at_home=AT_HOME,
    )

    print(exerciseDay)
    
    historics = fs.query('exercises')
    fs.delete('exercises', exerciseDay.day)
    print(historics)

    prompt = f'''
    HISTORICAL_TRAINING_DATA --
    {json.dumps(historics, indent=2)}
    --------------
    
    CURRENT_DAY --
    {json.dumps(exerciseDay.model_dump(), indent=2)}
    --------------
    
    EXTRA COMMENTS --
    {extra_comments}
    --------------
    '''
    print(prompt)
    output = vertex.call_agent(agent=agent, prompt=prompt)
    today = process_output(output)
    print(today)
    fs.insert('exercises', data=today.model_dump(), doc_id=today.day)
