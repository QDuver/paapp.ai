import datetime
from typing import ClassVar, Dict, Optional, Type, TypeVar, List, Union, Any
from pydantic import BaseModel, Field
from config import CONFIG
from clients.vertex import Agent
from utils import json_to_model
today = datetime.datetime.now().strftime('%Y-%m-%d')
T = TypeVar('T', bound=BaseModel)

class Entity(BaseModel):
    name: str
    items: List[Any] = Field(default_factory=list, description="List of nested Entity objects")

class FirestoreDoc(BaseModel):
    id: str = today
    collection: str = ''
    items: Optional[List[Entity]] = None
    system_prompt: ClassVar[str] = ''
    response_model: ClassVar[Type[BaseModel]] = None
    ai_model: ClassVar[str] = 'gemini-2.0-flash-lite-001'

    def get_prompt(self) -> str:
        return CONFIG.USER_FS.collection('settings').document('settings').get().to_dict()[self.collection]['prompt']
        
    def save(self):
        CONFIG.USER_FS.collection(self.collection).document(self.id).set(self.model_dump(exclude_none=True))

    def query(self):
        data = CONFIG.USER_FS.collection(self.collection).document(self.id).get().to_dict()
        if data is None:
            self.save()
            return self
        return self.__class__(**data)

    def delete(self):
        [doc.delete() for doc in CONFIG.USER_FS.collection(self.collection).list_documents()]

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

    def get_unique(self) -> List[Dict]:
        unique_items = {}

        for doc in CONFIG.USER_FS.collection(self.collection).stream():
            doc_data = doc.to_dict()
            if not doc_data or 'items' not in doc_data:
                continue

            for item in doc_data['items']:
                name = item.get('name', '')
                if not name or (name in unique_items and doc.id <= unique_items[name]['date']):
                    continue

                unique_items[name] = {'name': name, 'date': doc.id, 'items': item.get('items', [])}

        return sorted([{'name': item['name'], 'items': item['items']}
                       for item in unique_items.values()], key=lambda x: x['name'])

    def build_with_ai(self, notes: Optional[str] = None) -> 'FirestoreDoc':
        agent = Agent()
        prompt = agent.prompt({
            'HISTORICAL_DATA': self.historics(self.collection, self.id),
            'USER_NOTES': notes
        })
        combined_prompt = self.system_prompt.format(USER_PROMPT=self.get_prompt())
        output = agent.call(si=combined_prompt, prompt=prompt, model=self.ai_model, schema=self.response_model)
        result = json_to_model(output, model=self.response_model)
        instance = self.__class__(
            id=self.id,
            notes=notes,
            items=result.items
        )
        instance.save()
        return instance
    