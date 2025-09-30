from typing import Optional
from clients.agent import Agent
from google.cloud import firestore

vertex_instances: dict[Optional[str], Agent] = {}
current_user = None

def get_agent(model: Optional[str] = None) -> Agent:
    if model not in vertex_instances:
        vertex_instances[model] = Agent(model=model) if model else Agent()
    return vertex_instances[model]

def get_firestore_client(database=None):
    database = database or current_user.fs_name
    return firestore.Client(project="final-app-429707", database=database)

def get_agent_lite() -> Agent:
    return get_agent('gemini-2.0-flash-lite-001')

def get_agent_smart() -> Agent:
    return get_agent('gemini-2.5-pro')

def set_current_user(user) -> None:
    global current_user
    current_user = user

def get_current_user():
    return current_user
