


from google.cloud import firestore
import os


class Firestore:
    def __init__(self, database):
        self.client = firestore.Client(database=database)

    def insert(self, collection, data, doc_id=None):
        try:
            collection_ref = self.client.collection(collection)
            if doc_id:
                doc_ref = collection_ref.document(doc_id)
                doc_ref.set(data)
                print(f"Document set with ID: {doc_id}")
                return doc_id
            else:
                timestamp, doc_ref = collection_ref.add(data)
                print(f"Document added with ID: {doc_ref.id}")
                return doc_ref.id
        except Exception as e:
            print(f"Error inserting data into Firestore: {str(e)}")
            return None
        
    def get(self, collection, doc_id):
        try:
            doc_ref = self.client.collection(collection).document(doc_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            else:
                print(f"No document found with ID: {doc_id}")
                return None
        except Exception as e:
            print(f"Error retrieving document: {str(e)}")
            return None

    def query(self, collection, limit=100):
        try:
            collection_ref = self.client.collection(collection)
            docs = collection_ref.limit(limit).stream()
            
            results = []
            for doc in docs:
                doc_data = doc.to_dict()
                doc_data['id'] = doc.id
                results.append(doc_data)
            
            return results
            
        except Exception as e:
            print(f"Error querying Firestore: {str(e)}")
            return []

    def delete(self, collection, doc_id):
        try:
            doc_ref = self.client.collection(collection).document(doc_id)
            doc_ref.delete()
        except Exception as e:
            print(f"Error deleting document: {str(e)}")
            
            
    def update(self, collection, doc_id, path, value):
        # path is an array of string / numbers.
        # if string, it is a key in the dict.
        # if number, it is an index in the list.
        
        # if value can be casted to float, it will be casted.
        if isinstance(value, str) and value.replace('.', '', 1).isdigit():
            value = float(value)

        try:
            doc_ref = self.client.collection(collection).document(doc_id)
            doc = doc_ref.get()
            if not doc.exists:
                print(f"No document found with ID: {doc_id}")
                return
            
            data = doc.to_dict()
            current = data
            for key in path[:-1]:
                if isinstance(current, dict):
                    current = current.setdefault(key, {})
                elif isinstance(current, list) and isinstance(key, int):
                    while len(current) <= key:
                        current.append(None)
                    current = current[key]
                else:
                    raise ValueError("Invalid path for update")
            
            if isinstance(current, dict):
                current[path[-1]] = value
            elif isinstance(current, list) and isinstance(path[-1], int):
                while len(current) <= path[-1]:
                    current.append(None)
                current[path[-1]] = value
            else:
                raise ValueError("Invalid path for update")
            
            doc_ref.set(data)
            print(f"Document updated with ID: {doc_id}")
        except Exception as e:
            print(f"Error updating document: {str(e)}")