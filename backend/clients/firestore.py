
from google.cloud import firestore
from datetime import datetime
from typing import List, Dict, Any, Optional
import subprocess
from google.api_core import exceptions


class ExtendedFirestoreClient(firestore.Client):

    def __init__(self, database, **kwargs):
        # Ensure database exists before connecting
        if self._ensure_database_exists(database):
            super().__init__(database=database, **kwargs)
        else:
            raise Exception(f"Could not create or access database: {database}")

    def _ensure_database_exists(self, database_name: str, project_id: str = "final-app-429707") -> bool:
        try:
            temp_client = firestore.Client(database=database_name, project=project_id)
            list(temp_client.collections())
            return True
        except exceptions.NotFound:
            print(f"Database {database_name} not found, creating...")
            result = subprocess.run([
                "gcloud", "firestore", "databases", "create",
                "--database", database_name,
                "--location", "us-central",
                "--project", project_id
            ], capture_output=True, text=True, timeout=60)
            return result.returncode == 0


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
    
