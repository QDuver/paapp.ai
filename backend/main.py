
from datetime import datetime
import json
import requests

from google.cloud import firestore
from quentinDuverge import meals, routines
from quentinDuverge.exercises import Exercises
from quentinDuverge.routines import ROUTINE_TEMPLATE, Routines, Routine
from quentinDuverge.meals import Meal, Meals


if __name__ == "__main__":

    # routines = Routines().query()
    # Routines().delete()
    # Exercises().delete()
    # Meals().delete()
    Routines().buildItems()
    Exercises().buildItems()
    Meals().buildItems()
    # print(json.dumps(exercises.model_dump(), indent=2))

    # ex = requests.post(
        # "http://localhost:8000/quentin-duverge/build-items/routines/2025-09-01", json={})
    
    # print(ex.json())
