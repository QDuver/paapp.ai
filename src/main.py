
from datetime import datetime, time
from clients.firestore import Firestore
from clients.vertex import Vertex
from agents import exercice
from models import Day, Exercises, RunningDistance, WorkOut
import json
from datetime import date

if __name__ == "__main__":

    historics = [
        Day(
            date=datetime(2025, 7, 22),
            sleep_quality=8,
            wakeup_time=time(7, 30),
            exercises=Exercises(
                exercises=[
                    WorkOut(exercise='Biceps Curls',
                            repetitions=12, sets=3, weight_kg=10),
                    WorkOut(exercise='Bench Press',
                            repetitions=5, sets=5, weight_kg=15),
                    WorkOut(exercise='Lateral Raise',
                            repetitions=7, sets=4, weight_kg=6),
                ],
                available_time_min=60
            )
        ),
        Day(
            date=datetime(2025, 7, 23),
            sleep_quality=6,
            wakeup_time=time(7, 30),
            exercises=Exercises(
                exercises=[
                    RunningDistance(distance_km=4.72, duration=time(0, 27, 54)),
                    WorkOut(exercise='Push Ups', repetitions=10, sets=3),
                    WorkOut(exercise='Planks', duration_sec=60, sets=2),
                ],
                available_time_min=25 
            )
        ),
    ]
    json_historics = [day.model_dump() for day in historics]
    historical_data_str = json.dumps(json_historics, indent=2, default=str)
    prompt = f"Historical training data:\n{historical_data_str}\n\nBased on this data, fill in today's Exercise plan."
    vertex = Vertex()
    today = vertex.call_agent(agent=exercice, prompt=prompt)
    print(today)
    # Convert JSON string back to Day object
