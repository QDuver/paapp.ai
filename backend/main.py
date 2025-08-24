
from datetime import datetime
import json
import requests

from google.cloud import firestore
from quentinDuverge import meals, routines
from quentinDuverge.exercises import Exercises
from quentinDuverge.routines import ROUTINE_TEMPLATE, Routines, Routine
from quentinDuverge.meals import Meal, Meals


if __name__ == "__main__":

    # routines = Routines.build_base()
    routines = Routines.build_from_db()
    print(json.dumps(routines.model_dump(), indent=2))

    # ex = requests.get("http://localhost:8000/quentin-duverge/days/2025-08-24")