import datetime
from typing import ClassVar, Dict, Optional, Type, TypeVar, List, Union, Any
from pydantic import BaseModel, Field
from config import CONFIG
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
    generic_prompt: str = ""


    def __init__(self, **data):
        if 'id' not in data or data['id'] is None:
            data['id'] = today
        super().__init__(**data)
        self.collection = COLLECTION_MAPPING[self.__class__.__name__]
        
    def insert_generic_prompt(self):
        CONFIG.USER_FS.collection('prompts').document(self.collection).set({'prompt': self.generic_prompt})

    def save(self):
        CONFIG.USER_FS.collection(self.collection).document(self.id).set(self.model_dump(exclude_none=True))

    def query(self):
        data = CONFIG.USER_FS.collection(self.collection).document(self.id).get().to_dict()
        if data is None:
            self.save()
            self.insert_generic_prompt()
            return self
        return self.__class__(**data)

    def delete(self):
        CONFIG.USER_FS.collection(self.collection).document(self.id).delete()

    def historics(self, collection: str, day: str):
        documents = [doc.id for doc in CONFIG.USER_FS.collection(collection).list_documents()]
        past_documents = [doc for doc in documents if doc < day]
        historics = []

        for doc_id in past_documents:
            doc_data = CONFIG.USER_FS.collection(
                collection).document(doc_id).get().to_dict()
            if doc_data: 
                historics.append(doc_data)

        return historics
    