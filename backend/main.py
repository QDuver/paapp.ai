
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
    # Meals().build_items()
    
    Routines().build_items()
    # Exercises().build_items()
    # exercises = Exercises().get_unique()
    # print(json.dumps(exercises, indent=2))
    # Meals().build_items()
    # print(json.dumps(exercises.model_dump(), indent=2))

    # ex = requests.get("http://localhost:8000/quentin-duverge/routines/2025-09-21")
    # print(ex.json())
