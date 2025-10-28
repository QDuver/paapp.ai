

import datetime
from typing import List, Optional, Literal, ClassVar
from pydantic import BaseModel, Field
from config import CONFIG
from models.exercises import Exercise, Exercises
from models.meals import Meal, Meals
from models.abstracts import Entity, FirestoreDoc


class Routine(Entity):
    name: str
    isCompleted: bool = False


class Routines(FirestoreDoc):
    collection: str = 'routines'
    wakeupTime: Optional[str] = Field(default_factory=lambda: datetime.datetime.now().strftime("%H:%M"))
    items: List[Routine] = [
    Routine(name='Journaling'),
    Routine(name='Meditating'),
    Routine(name='Exercises'),
]

    def default(self):
        previous_date = (datetime.datetime.strptime(CONFIG.today, "%Y-%m-%d") - datetime.timedelta(days=1)).strftime("%Y-%m-%d")
        previous_data = CONFIG.USER_FS.collection(self.collection).document(previous_date).get().to_dict()

        if previous_data:
            previous_data['id'] = self.id
            if 'items' in previous_data:
                for item in previous_data['items']:
                    item['isCompleted'] = False

            instance = self.__class__(**previous_data)
            instance.save()
            return instance

        self.save()
        return self