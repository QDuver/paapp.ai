import json
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from migrations.harmonize_names import harmonize_exercise_names
from migrations.rest_to_null import rest_to_null
from clients.shared import get_firestore_client
fs = get_firestore_client('quentin-duverge')

def create_backup(collection):
    source_col_ref = fs.collection(collection)
    backup_col_ref = fs.collection(collection + '_backup')
    docs = source_col_ref.get()
    
    for doc in docs:
        doc_data = doc.to_dict()
        backup_col_ref.document(doc.id).set(doc_data)
        

if __name__ == "__main__":

    create_backup('exercises')
    print("\nStarting migration")
    harmonize_exercise_names(fs)
    print("\nMigration completed!")