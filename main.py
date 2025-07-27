

from clients.firestore import Firestore
from clients.vertex import Vertex
from agents import exercice
import json
from datetime import date
from models import Day
import requests

def call_agent_mock():
    print("Mock call to agent")
    return {"message": "Hello, Agent!"}


def call_agent():
    
    SLEEP_QUALITY = 7
    WAKEUP_TIME = "05:30"
    AVAILABLE_EXERCISE_TIME = 40
    today = Day(
        sleep_quality=SLEEP_QUALITY,
        wakeup_time=WAKEUP_TIME,
        available_exercise_time=AVAILABLE_EXERCISE_TIME,
        at_home=True,
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
    if isinstance(output_data, list) and len(output_data) > 0:
        today = Day(**output_data[0])
    else:
        today = Day(**output_data)

    print(today)
    fs.insert(collection='routine', data=today.model_dump(), doc_id=today.date)
    
    
if __name__ == "__main__":
    baseURL = 'https://life-automation-api-1050310982145.europe-west2.run.app'
    # baseURL = "http://localhost:8000"   
    response = requests.get(f"{baseURL}/")
    print(response.json())
    # call_agent_mock()
    
 