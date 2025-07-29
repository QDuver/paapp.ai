


from google.cloud import firestore
import os


class Firestore:
    def __init__(self):
        self.client = firestore.Client(database='routine')
        
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

    def delete(self, collection, doc_id):
        try:
            doc_ref = self.client.collection(collection).document(doc_id)
            doc_ref.delete()
        except Exception as e:
            print(f"Error deleting document: {str(e)}")