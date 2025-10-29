from fastapi import APIRouter
from clients.firestore import FirestoreClient
from config import CONFIG, COLLECTION_CLASS_MAPPING

router = APIRouter()

@router.get("/delete-incomplete")
def delete_incomplete():
    for db_name in FirestoreClient.get_all_dbs():
        CONFIG.USER_FS = FirestoreClient.get_user_db(db_name)
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
    for db_name in FirestoreClient.get_all_dbs():
        CONFIG.USER_FS = FirestoreClient.get_user_db(db_name)
        for collection in ['exercises', 'meals']:
            instance =  COLLECTION_CLASS_MAPPING[collection]()
            instance.build_with_ai()

    return {}


@router.get("/uniques")
def uniques():
    for db_name in FirestoreClient.get_all_dbs():
        CONFIG.USER_FS = FirestoreClient.get_user_db(db_name)
        for collection in ['meals', 'routines', 'exercises']:
            unique_items = COLLECTION_CLASS_MAPPING[collection]().get_unique()
            CONFIG.USER_FS.collection(collection).document('uniques').set({'uniques': unique_items})

    return {}



@router.get("/build-dbs")
def build_dbs():
    created_dbs = FirestoreClient.build_dbs(count=5)
    all_dbs = FirestoreClient.get_all_dbs()

    for db_name in all_dbs:
        print('DB:', db_name)

    return {'created': created_dbs, 'all_databases': all_dbs}
