from clients.shared import get_firestore_client


def create_backup(collection):
    fs = get_firestore_client()
    source_col_ref = fs.collection(collection)
    backup_col_ref = fs.collection(collection + '_backup')
    docs = source_col_ref.get()
    
    for doc in docs:
        doc_data = doc.to_dict()
        backup_col_ref.document(doc.id).set(doc_data)


def replace_meal_type_keys(data):
    """Recursively replace 'meal_type' keys with 'mealType' in nested dictionaries and lists"""
    if isinstance(data, dict):
        new_data = {}
        for key, value in data.items():
            # Replace the key if it's 'meal_type'
            new_key = 'mealType' if key == 'meal_type' else key
            # Recursively process the value
            new_data[new_key] = replace_meal_type_keys(value)
        return new_data
    elif isinstance(data, list):
        # Process each item in the list
        return [replace_meal_type_keys(item) for item in data]
    else:
        # Return the value as-is for non-dict, non-list types
        return data


def migrate_meal_type_to_mealType():
    """Migrate all documents in the meals collection to use 'mealType' instead of 'meal_type'"""
    fs = get_firestore_client()
    col_ref = fs.collection('meals')
    docs = col_ref.get()
    
    updated_count = 0
    
    for doc in docs:
        doc_data = doc.to_dict()
        
        # Check if the document contains 'meal_type' keys
        original_json = str(doc_data)
        if 'meal_type' in original_json:
            # Replace 'meal_type' keys with 'mealType'
            updated_data = replace_meal_type_keys(doc_data)
            
            # Update the document in Firestore
            col_ref.document(doc.id).set(updated_data)
            updated_count += 1
            print(f"Updated document {doc.id}")
    
    print(f"Migration completed. Updated {updated_count} documents.")


def main():
    # Create backup before migration
    # print("Creating backup of meals collection...")
    # create_backup('meals')
    # print("Backup created successfully.")
    
    # # Run the migration
    # print("Starting migration to replace 'meal_type' with 'mealType'...")
    migrate_meal_type_to_mealType()

if __name__ == "__main__":
    main()