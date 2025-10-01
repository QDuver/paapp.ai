import sys
import os


def rest_to_null(fs):
    exercises_ref = fs.collection('exercises')
    docs = exercises_ref.stream()
    
    for doc in docs:
        doc_data = doc.to_dict()
        if not doc_data or 'items' not in doc_data:
            continue
            
        updated = False
        for exercise in doc_data['items']:
            if 'items' in exercise:
                for exercise_set in exercise['items']:
                    if 'rest' in exercise_set and exercise_set['rest'] is None:
                        del exercise_set['rest']
                        updated = True
        
        if updated:
            exercises_ref.document(doc.id).set(doc_data)

