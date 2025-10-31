from fastapi import APIRouter, Depends, HTTPException, Header
from clients.firestore import FirestoreClient
from config import CONFIG, COLLECTION_CLASS_MAPPING
from models.users import User
from typing import Optional
import os

router = APIRouter()

def get_admin_emails():
    admin_emails_str = os.getenv('ADMIN_EMAILS', '')
    return [email.strip() for email in admin_emails_str.split(',') if email.strip()]

def verify_admin(x_api_key: Optional[str] = Header(None), user: Optional[User] = Depends(User.from_firebase_token)):
    api_key = os.getenv('API_KEY')

    if api_key and x_api_key == api_key:
        return None

    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")

    admin_emails = get_admin_emails()
    if not admin_emails:
        raise HTTPException(status_code=503, detail="Admin functionality not configured")
    if user.email not in admin_emails:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/delete-incomplete")
def delete_incomplete(user: User = Depends(verify_admin)):
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
def schedule_day(user: User = Depends(verify_admin)):
    for db_name in FirestoreClient.get_all_dbs():
        CONFIG.USER_FS = FirestoreClient.get_user_db(db_name)
        for collection in ['exercises', 'meals']:
            instance =  COLLECTION_CLASS_MAPPING[collection]()
            instance.build_with_ai()

    return {}


@router.get("/uniques")
def uniques(user: User = Depends(verify_admin)):
    for db_name in FirestoreClient.get_all_dbs():
        CONFIG.USER_FS = FirestoreClient.get_user_db(db_name)
        for collection in ['meals', 'routines', 'exercises']:
            unique_items = COLLECTION_CLASS_MAPPING[collection]().get_unique()
            CONFIG.USER_FS.collection(collection).document('uniques').set({'uniques': unique_items})

    return {}



@router.get("/build-dbs")
def build_dbs(user: User = Depends(verify_admin)):
    created_dbs = FirestoreClient.build_dbs(count=5)
    all_dbs = FirestoreClient.get_all_dbs()

    return {'created': created_dbs, 'all_databases': all_dbs}
