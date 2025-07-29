

from clients.firestore import Firestore
from clients.vertex import Vertex
from config import get_base_url, Config
import json
from datetime import date
from models import Day
import requests

vertex = Vertex()
fs = Firestore()


def process_output(output):
    output_data = json.loads(output)
    if isinstance(output_data, list) and len(output_data) > 0:
        return Day(**output_data[0])
    else:
        return Day(**output_data)


def init_day():
    
    SLEEP_QUALITY = 8
    WAKEUP_TIME = "09:00"
    AVAILABLE_EXERCISE_TIME = 60
    today_init = Day(
        sleep_quality=SLEEP_QUALITY,
        wakeup_time=WAKEUP_TIME,
        available_exercise_time=AVAILABLE_EXERCISE_TIME,
        at_home=True,
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
    Today, I'd specifically like to train the back
    --------------
    '''
    print(prompt)
    output = vertex.call_agent(agent=open("agents.md").read(), prompt=prompt)
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
    output = vertex.call_agent(agent=open("agents.md").read(), prompt=prompt)
    today = process_output(output)
    
    fs.insert(collection='routine', data=today.model_dump(), doc_id=today.date)
    
    
if __name__ == "__main__":
    init_day()
    # modify_day()
    # print(requests.get(f"{Config.BASE_URL}/todays-exercices").json())