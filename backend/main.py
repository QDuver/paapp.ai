

from clients.firestore import Firestore
from clients.vertex import Vertex
import json
from datetime import date
from models import Day
from agents import agent
import requests
vertex = Vertex()
fs = Firestore()


def process_output(output):
    output_data = json.loads(output)
    if isinstance(output_data, list) and len(output_data) > 0:
        return Day(**output_data[0])
    else:
        return Day(**output_data)


def init_day(extra_comments="None"):
    
    SLEEP_QUALITY = 5
    WAKEUP_TIME = "09:00"
    AVAILABLE_EXERCISE_TIME = 60
    AT_HOME = False
    today_init = Day(
        sleep_quality=SLEEP_QUALITY,
        wakeup_time=WAKEUP_TIME,
        available_exercise_time=AVAILABLE_EXERCISE_TIME,
        at_home=AT_HOME,
    )

    fs.delete(collection='routine', doc_id=today_init.date)
    historics = fs.query(collection='routine', limit=10)
    historics = [x for x in historics if x['date'] < date.today().strftime("%Y-%m-%d")]
    print(historics)

    prompt = f'''
    HISTORICAL_TRAINING_DATA --
    {json.dumps(historics, indent=2)}
    --------------
    
    CURRENT_DAY --
    {json.dumps(today_init.model_dump(), indent=2)}
    --------------
    
    EXTRA COMMENTS --
    {extra_comments}
    --------------
    '''
    print(prompt)
    output = vertex.call_agent(agent=agent, prompt=prompt)
    today = process_output(output)
    fs.insert(collection='routine', data=today.model_dump(), doc_id=today.date)
    
    
def modify_day():
    today = fs.get(collection='routine', doc_id=date.today().strftime("%Y-%m-%d"))
    today = Day(**today)
    
    prompt = f'''
    CURRENT_DAY --
    {json.dumps(today.model_dump(), indent=2)}
    --------------
    
    EXTRA COMMENTS --
    For today's day, I don't have 8 exercices, despite having 60 minutes available.
    Also please add Pull Downs, Shrugs and some Leg exercice.
    --------------
    '''
    print(prompt)
    output = vertex.call_agent(agent=open("backend/agents.md").read(), prompt=prompt)
    today = process_output(output)
    
    fs.insert(collection='routine', data=today.model_dump(), doc_id=today.date)
    
    
if __name__ == "__main__":
    init_day()
    # day = fs.get(collection='routine', doc_id='2025-07-30')
    # fs.insert(collection='routine', data=day, doc_id='2025-07-31')
    # fs.update(collection='routine', doc_id='2025-07-31', path=['exercises', 0, 'rest'], value=60)
    # exercisesx3 = []
    # for exercise in day['exercises']:
    #     exercisesx3.extend([exercise] * 3)
    # # print(exercisesx3)
    # day['exercises'] = exercisesx3
    # fs.insert(collection='routine', data=day, doc_id='2025-07-30')
    # requests.post("http://localhost:8000/update-db/routine/2025-07-31", json={"path": ["exercises", 0, "rest"], "value": 90})