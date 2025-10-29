
import datetime
import os

PROJECT = 'final-app-429707'
    
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


class Config:
    BASE_URL = get_base_url()
    ENVIRONMENT = get_environment_name()
    IS_LOCAL = is_local_environment()
    CLOUD_RUN_URL = 'https://life-automation-api-1050310982145.europe-west2.run.app'
    LOCAL_URL = "http://localhost:8000"
    user = None
    USER_FS = None

    @property
    def today(self):
        return datetime.datetime.now().strftime('%Y-%m-%d')

CONFIG = Config()
from models.exercises import Exercises
from models.groceries import Groceries
from models.meals import Meals
from models.routines import Routines
from models.settings import Settings

COLLECTION_CLASS_MAPPING = {
    'exercises': Exercises,
    'meals': Meals,
    'routines': Routines,
    'groceries': Groceries,
    'settings': Settings,
}

if __name__ == "__main__":
    pass