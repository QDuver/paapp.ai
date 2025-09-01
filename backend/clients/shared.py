from typing import Optional
from clients.agent import Agent
from clients.firestore import ExtendedFirestoreClient


class SharedResources:
    _instance: Optional['SharedResources'] = None
    _vertex_instances: dict[Optional[str], Agent] = {}
    _firestore_clients: dict[str, ExtendedFirestoreClient] = {}
    
    def __new__(cls) -> 'SharedResources':
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def get_agent(self, model: Optional[str] = None) -> Agent:
        if model not in self._vertex_instances:
            self._vertex_instances[model] = Agent(model=model) if model else Agent()
        return self._vertex_instances[model]
    
    def get_firestore_client(self, database: str) -> ExtendedFirestoreClient:
        if database not in self._firestore_clients:
            self._firestore_clients[database] = ExtendedFirestoreClient(database=database)
        return self._firestore_clients[database]


_shared_resources = SharedResources()

def get_agent_lite() -> Agent:
    return _shared_resources.get_agent('gemini-2.0-flash-lite-001')

def get_agent_smart() -> Agent:
    return _shared_resources.get_agent('gemini-2.5-pro')

def get_firestore_client(database: str) -> ExtendedFirestoreClient:
    return _shared_resources.get_firestore_client(database)
