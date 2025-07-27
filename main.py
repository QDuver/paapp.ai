

from quentind.exercices import call_exercice_agent
from quentind.models import Day, WorkOut, RunningDistance, RunningIntervals
from pydantic import ValidationError


if __name__ == "__main__":
    # baseURL = 'https://life-automation-api-1050310982145.europe-west2.run.app'
    # baseURL = "http://localhost:8000"
    # response = requests.get(f"{baseURL}/")
    # print(response.json())
    call_exercice_agent()

    # obj = {
    #     "date": "2025-07-27",
    #     "wakeup_time": "05:30",
    #     "sleep_quaeeelity": 7,  # This typo will be filtered out
    #     "sleep_quality": 8,     # This is the correct field name
    #     "available_exercise_time": 40,
    #     "invalid_field": "this will be removed",  # This will be filtered out
    #     "exercises": [
    #         {
    #             "name": "Easy Run",
    #             "type": "Cardio",  # This will be filtered out (not in any exercise model)
    #             "distance_km": 5.0,  # This matches RunningDistance
    #             "duration": "30:00",  # This matches RunningDistance
    #             "intensity": "Easy",  # This will be filtered out
    #             "notes": "Focus on maintaining a conversational pace."  # This will be filtered out
    #         },
    #         {
    #             "name": "Push-ups",
    #             "weight_kg": None,  # This matches WorkOut
    #             "repetitions": 20,  # This matches WorkOut
    #             "sets": 3,  # This matches WorkOut
    #             "invalid_exercise_field": "remove me",  # This will be filtered out
    #             "at_home": True  # This matches WorkOut
    #         }
    #     ]
    # }