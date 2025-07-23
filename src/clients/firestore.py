


from google.cloud import firestore
import os


class Firestore:
    def __init__(self):
        self.client = firestore.Client(database='routine')

    def query(self, collection="routine", limit=10):
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

    def query_with_filters(self, collection, field_name=None, operator=None, value=None):
        try:
            collection_ref = self.client.collection(collection)
            
            if field_name and operator and value is not None:
                docs = collection_ref.where(field_name, operator, value).stream()
            else:
                docs = collection_ref.stream()
            
            results = []
            for doc in docs:
                doc_data = doc.to_dict()
                doc_data['id'] = doc.id
                results.append(doc_data)
            
            return results
            
        except Exception as e:
            print(f"Error querying Firestore with filters: {str(e)}")
            return []
