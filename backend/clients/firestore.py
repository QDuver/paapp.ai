
from google.cloud import firestore
from datetime import datetime
from typing import List, Dict, Any, Optional


class ExtendedFirestoreClient(firestore.Client):

    def __init__(self, database, **kwargs):
        super().__init__(database=database, **kwargs)

    def historics(self, collection: str, day: str) -> List[Dict[str, Any]]:
        documents = [doc.id for doc in self.collection( collection).list_documents()]
        past_documents = [doc for doc in documents if doc < day]
        historics = []

        for doc_id in past_documents:
            doc_data = self.collection(
                collection).document(doc_id).get().to_dict()
            if doc_data:  # Only add if document exists and has data
                historics.append(doc_data)

        return historics
    
