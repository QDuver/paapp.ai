import json
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import CONFIG

def harmonize_exercise_names(fs):
    name_mapping = {
        "Barbell Calf Raise": "Barbell Calf Raises",
        "Face Pull": "Face Pulls",
        "Lateral Raise": "Lateral Raises", 
        "Plank": "Planks",
        "Romanian Deadlifts": "Romanian Deadlift"
    }
    
    exercises_ref = fs.collection('exercises')
    updated_count = 0
    
    # Get all documents in the exercises collection
    all_docs = exercises_ref.stream()
    
    for doc in all_docs:
        doc_data = doc.to_dict()
        
        if not doc_data or 'items' not in doc_data:
            continue
            
        items = doc_data['items']
        updated_items = False
        
        # Check each exercise item in the document
        for i, exercise in enumerate(items):
            if 'name' not in exercise:
                continue
                
            exercise_name = exercise['name']
            
            # Check if this exercise name needs to be updated
            if exercise_name in name_mapping:
                new_name = name_mapping[exercise_name]
                items[i]['name'] = new_name
                updated_items = True
                updated_count += 1
        
        # Update the document if any items were modified
        if updated_items:
            doc.reference.update({'items': items})
    

if __name__ == "__main__":
    fs = CONFIG.get_firestore_client()
    
    harmonize_exercise_names(fs)