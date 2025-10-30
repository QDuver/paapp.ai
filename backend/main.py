from datetime import datetime
import json
import requests

from clients.firestore import FirestoreClient
from config import CONFIG
from models.exercises import Exercises
from models.groceries import Groceries
from models.meals import Meal, Meals
from models.settings import Settings
from models.routines import Routines
from models.abstracts import FirestoreDoc
from models.users import User

if __name__ == "__main__":
    print(Settings())