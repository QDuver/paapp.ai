from fastapi import APIRouter
from google.cloud import firestore

from config import CONFIG, PROJECT, get_all_database_names

router = APIRouter()

@router.get("/delete-incomplete")
def delete_incomplete():
    for db_name in get_all_database_names():
        CONFIG.USER_FS = firestore.Client(project=PROJECT, database=db_name)
        for collection in ['exercises', 'meals', 'groceries']:
            docs = CONFIG.USER_FS.collection(collection).stream()
            for doc in docs:
                if doc.id == CONFIG.today:
                    continue
                data = doc.to_dict()
                if 'items' in data and isinstance(data['items'], list):
                    if(collection == 'groceries'):
                        data['items'] = [item for item in data['items'] if item.get('isCompleted') == False]
                    else:
                        data['items'] = [item for item in data['items'] if item.get('isCompleted') == True]
                    if len(data['items']) == 0:
                        doc.reference.delete()
                    else:
                        doc.reference.set(data)

    return {}

@router.get("/schedule")
def schedule_day():
    from models.exercises import Exercises
    from models.meals import Meals

    COLLECTION_CLASS_MAPPING = {
        'exercises': Exercises,
        'meals': Meals,
    }

    for db_name in get_all_database_names():
        CONFIG.USER_FS = firestore.Client(project=PROJECT, database=db_name)
        for collection in ['exercises', 'meals']:
            instance =  COLLECTION_CLASS_MAPPING[collection]()
            instance.build_with_ai()

    return {}


@router.get("/uniques")
def uniques():
    from models.exercises import Exercises
    from models.meals import Meals
    from models.routines import Routines

    COLLECTION_CLASS_MAPPING = {
        'exercises': Exercises,
        'meals': Meals,
        'routines': Routines,
    }

    for db_name in get_all_database_names():
        CONFIG.USER_FS = firestore.Client(project=PROJECT, database=db_name)
        for collection in ['meals', 'routines', 'exercises']:
            unique_items = COLLECTION_CLASS_MAPPING[collection]().get_unique()
            CONFIG.USER_FS.collection(collection).document('uniques').set({'uniques': unique_items})

    return {}
