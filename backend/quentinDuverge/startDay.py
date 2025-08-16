import json
from datetime import date
import requests
from clients.vertex import Vertex
from quentinDuverge.models import ExerciseDay, Meal, ProcessedComment
from quentinDuverge.agents import exercise_agent, process_comments_agent, nutrition_agent
from google.cloud import firestore

from utils import process_output

vertex = Vertex()
fs = firestore.Client(database='quentin-duverge')

def meals(notes=None):

    prompt = f'''
    HISTORICAL_MEALS --
    --------------
    
    CURRENT_DAY --
    {json.dumps(Meal(day=date.today().strftime("%Y-%m-%d"), meal_type="lunch").model_dump(), indent=2)}
    --------------
    
    EXTRA COMMENTS --
    {notes}
    --------------
    '''
    
    print(prompt)
    output = Vertex(model='gemini-2.0-flash-lite-001').call_agent( agent=nutrition_agent, prompt=prompt, schema=Meal)
    print(output)
    meal = process_output(output, model=Meal)
    fs.collection('meals').document(f'{meal.day} - {meal.meal_type}').set(meal.model_dump())
    return meal.model_dump()

def exercises(notes=None):

    if (notes):
        notes = Vertex(model='gemini-2.0-flash-lite-001').call_agent(
            agent=process_comments_agent, prompt=notes, schema=ProcessedComment)
        notes = process_output(notes, model=ProcessedComment).training
        print('notes', notes)

    WAKEUP_TIME = "09:00"
    AVAILABLE_EXERCISE_TIME = 60
    AT_HOME = False
    exerciseDay = ExerciseDay(
        day=date.today().strftime("%Y-%m-%d"),
        wakeupTime=WAKEUP_TIME,
        availableExerciseTime=AVAILABLE_EXERCISE_TIME,
        atHome=AT_HOME,
    )

    historics = fs.collection('exercises').where(
        'day', '<', exerciseDay.day).order_by('day').stream()
    historics = [ExerciseDay(**doc.to_dict()) for doc in historics]
    fs.collection('exercises').document(exerciseDay.day).delete()

    prompt = f'''
    HISTORICAL_TRAINING_DATA --
    {json.dumps([h.model_dump() for h in historics], indent=2)}
    --------------
    
    CURRENT_DAY --
    {json.dumps(exerciseDay.model_dump(), indent=2)}
    --------------
    
    EXTRA COMMENTS --
    {notes}
    --------------
    '''
    print(prompt)
    output = vertex.call_agent(
        agent=exercise_agent, prompt=prompt, schema=ExerciseDay)
    today = process_output(output, model=ExerciseDay)
    fs.collection('exercises').document(today.day).set(today.model_dump())
    return today.model_dump()
