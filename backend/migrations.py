import json
from clients.shared import get_firestore_client

fs = get_firestore_client('quentin-duverge')

def create_backup(collection):
    source_col_ref = fs.collection(collection)
    backup_col_ref = fs.collection(collection + '_backup')
    docs = source_col_ref.get()
    
    for doc in docs:
        doc_data = doc.to_dict()
        backup_col_ref.document(doc.id).set(doc_data)

def pull_example(collection, doc):
    obj = fs.collection(collection).document(doc).get()
    return obj.to_dict()

def migrate():
    """Set all 'rest' fields to null in exercise items"""
    collection_ref = fs.collection('exercises')
    docs = collection_ref.get()
    
    updated_count = 0
    
    for doc in docs:
        doc_data = doc.to_dict()
        doc_updated = False
        
        # Check if this document has items (exercises)
        if 'items' in doc_data:
            for exercise in doc_data['items']:
                if 'items' in exercise:
                    for item in exercise['items']:
                        if 'rest' in item:
                            # Set rest field to null
                            item['rest'] = None
                            doc_updated = True
        
        # Update the document if any changes were made
        if doc_updated:
            collection_ref.document(doc.id).set(doc_data)
            updated_count += 1
            print(f"Updated document: {doc.id}")
    
    print(f"Migration completed. Updated {updated_count} documents.")


if __name__ == "__main__":
    # Pull an example to see current structure
    # obj = pull_example('exercises', '2025-09-07')
    # print("Current document structure:")
    # print(json.dumps(obj, indent=2))

    # # Create backup before migration
    # print("\nCreating backup...")
    # create_backup('exercises')
    # print("Backup created successfully.")
    
    # # Run the migration
    print("\nStarting migration to rename 'sets' to 'items'...")
    migrate()
    print("\nMigration completed!")