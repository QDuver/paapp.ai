

from clients.firestore import Firestore
from clients.vertex import Vertex
from agents import exercice
import json
from datetime import date

from database import database
from models import Day

if __name__ == "__main__":

    SLEEP_QUALITY = 7
    WAKEUP_TIME = "06:00"
    AVAILABLE_EXERCISE_TIME = 40
    today = Day(
        sleep_quality=SLEEP_QUALITY,
        wakeup_time=WAKEUP_TIME,
        available_exercise_time=AVAILABLE_EXERCISE_TIME
    )

    fs = Firestore()
    historics = fs.query(collection='routine', limit=10)
    historics = [x for x in historics if x['date'] < date.today().strftime("%Y-%m-%d")]
    print(historics)

    prompt = f'''
    HISTORICAL_TRAINING_DATA --
    {json.dumps(historics, indent=2)}
    --------------
    
    CURRENT_DAY --
    {json.dumps(today.model_dump(), indent=2)}
    --------------
    Based on this data, fill in today's Exercise plan.
    '''
    print(prompt)
    vertex = Vertex()
    output = vertex.call_agent(agent=exercice, prompt=prompt)
    print(output)
    
    output_data = json.loads(output)
    # The AI returns a list with one Day object, so we take the first item
    if isinstance(output_data, list) and len(output_data) > 0:
        today = Day(**output_data[0])
    else:
        today = Day(**output_data)
    print(today)
    fs.insert(collection='routine', data=today.model_dump(), doc_id=today.date)
    
