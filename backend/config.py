"""
Configuration module for the life automation backend.
Handles environment-specific settings and URL configurations.
"""
import time
import os
import datetime
from typing import Optional
from google.cloud import firestore
from google.api_core import exceptions
from google.cloud import firestore_admin_v1
from google.cloud.firestore_admin_v1.types import Database

PROJECT = 'final-app-429707'

def build_fs_db(name):
    admin_client = firestore_admin_v1.FirestoreAdminClient()
    parent = f"projects/{PROJECT}"
    database = Database(
        name=f"{parent}/databases/{name}",
        location_id="europe-west2",
        type_=Database.DatabaseType.FIRESTORE_NATIVE
    )
    operation = admin_client.create_database(parent=parent, database=database, database_id=name)
    operation.result()

def get_all_database_names():
    admin_client = firestore_admin_v1.FirestoreAdminClient()
    parent = f"projects/{PROJECT}"
    response = admin_client.list_databases(parent=parent)
    return [db.name.split('/')[-1] for db in response.databases]
    
def get_base_url():
    if os.getenv('K_SERVICE') or os.getenv('GOOGLE_CLOUD_PROJECT'):
        return 'https://life-automation-api-1050310982145.europe-west2.run.app'
    
    if os.getenv('PORT') and not os.getenv('LOCALDEV'):
        return 'https://life-automation-api-1050310982145.europe-west2.run.app'
    
    return "http://localhost:8000"


def is_local_environment():
    return not (os.getenv('K_SERVICE') or os.getenv('GOOGLE_CLOUD_PROJECT') or 
                (os.getenv('PORT') and not os.getenv('LOCALDEV')))


def get_environment_name():
    if os.getenv('K_SERVICE'):
        return 'cloud-run'
    elif os.getenv('GOOGLE_CLOUD_PROJECT'):
        return 'gcp'
    elif os.getenv('PORT') and not os.getenv('LOCALDEV'):
        return 'cloud'
    else:
        return 'local'


# Configuration constants
class Config:
    """Configuration class with environment-specific settings."""

    BASE_URL = get_base_url()
    ENVIRONMENT = get_environment_name()
    IS_LOCAL = is_local_environment()
    CLOUD_RUN_URL = 'https://life-automation-api-1050310982145.europe-west2.run.app'
    LOCAL_URL = "http://localhost:8000"
    USER_FS = None
    user = None
    cache = {}

    @property
    def today(self):
        return datetime.datetime.now().strftime('%Y-%m-%d')
    
    
    def set_user(self, user):
        print('SET USER', user)
        self.user = user
        if user.fs_name not in self.cache:
            admin_client = firestore_admin_v1.FirestoreAdminClient()
            db_path = f"projects/{PROJECT}/databases/{user.fs_name}"
            try:
                admin_client.get_database(name=db_path)
                print('DATABASE EXISTS')
            except exceptions.NotFound:
                print('DATABASE DOES NOT EXIST')
                build_fs_db(user.fs_name)
            self.cache[user.fs_name] = firestore.Client(project=PROJECT, database=user.fs_name)
        self.USER_FS = self.cache[user.fs_name]

CONFIG = Config()


if __name__ == "__main__":
    pass