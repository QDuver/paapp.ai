import datetime
from typing import ClassVar, Optional, Type, TypeVar, List, Union, Any
from pydantic import BaseModel, Field
from clients.shared import get_firestore_client
fs = get_firestore_client('quentin-duverge')
today = datetime.datetime.now().strftime('%Y-%m-%d')
T = TypeVar('T', bound=BaseModel)
COLLECTION_MAPPING = {
    'Routines': 'routines',
    'Exercises': 'exercises',
    'Meals': 'meals'
}

class Entity(BaseModel):
    name: str
    items: List[Any] = Field(default_factory=list, description="List of nested Entity objects")

class FirestoreDoc(BaseModel):
    id: str
    collection: str = ''
    items: list[Entity]

    def __init__(self, **data):
        if 'id' not in data or data['id'] is None:
            data['id'] = today
        super().__init__(**data)
        self.collection = COLLECTION_MAPPING[self.__class__.__name__]

    def save(self):
        fs.collection(self.collection).document( self.id).set(self.model_dump(exclude_none=True))

    def query(self):
        data = fs.collection(self.collection).document(self.id).get().to_dict()
        if data is None:
            self.save()
            return self
        return self.__class__(**data)

    def delete(self):
        fs.collection(self.collection).document(self.id).delete()
