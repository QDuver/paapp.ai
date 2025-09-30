
from datetime import datetime
import json
import requests

from google.cloud import firestore
from clients.shared import get_firestore_client
from models import meals, routines
from models.exercises import Exercises
from models.routines import ROUTINE_TEMPLATE, Routines, Routine
from models.meals import Meal, Meals


if __name__ == "__main__":

    # routines = Routines().query()
    # Routines().delete()
    # Exercises().delete()
    # Meals().delete()
    # Meals().build_items()
    fs = get_firestore_client('qd-umileigiudber2rbzjguipjfys23')
    # Routines().build_items(fs)
    Exercises().build_items(fs)
    # exercises = Exercises().get_unique()
    # print(json.dumps(exercises, indent=2))
    # Meals().build_items()
    # print(json.dumps(exercises.model_dump(), indent=2))

    # ex = requests.get("http://localhost:8000/routines/2025-09-29")
    # print(ex.json())
