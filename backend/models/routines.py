

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
        all_docs = CONFIG.USER_FS.collection(self.collection).stream()

        filtered_docs = [doc for doc in all_docs if doc.id < self.id]

        if filtered_docs:
            latest_doc = max(filtered_docs, key=lambda doc: doc.id)
            latest_data = latest_doc.to_dict()
            latest_data['id'] = self.id
            if 'items' in latest_data:
                for item in latest_data['items']:
                    item['isCompleted'] = False

            instance = self.__class__(**latest_data)
            instance.save()
            return instance

        self.save()
        return self