
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

PROJECT = os.getenv('GOOGLE_CLOUD_PROJECT', 'your-project-id')
CLOUD_RUN_URL = os.getenv('CLOUD_RUN_URL', 'https://your-cloud-run-url.run.app')

def get_base_url():
    if os.getenv('K_SERVICE') or os.getenv('GOOGLE_CLOUD_PROJECT'):
        return CLOUD_RUN_URL

    if os.getenv('PORT') and not os.getenv('LOCALDEV'):
        return CLOUD_RUN_URL

    return os.getenv('LOCAL_URL', 'http://localhost:8000')


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
    CLOUD_RUN_URL = CLOUD_RUN_URL
    LOCAL_URL = os.getenv('LOCAL_URL', 'http://localhost:8000')
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