from google.cloud import firestore
from google.cloud import firestore_admin_v1
from google.cloud.firestore_admin_v1.types import Database
import random
import string
from config import PROJECT


class FirestoreClient(firestore.Client):

    def __init__(self):
        self.project_id = PROJECT
        self.parent = f"projects/{PROJECT}"        
        self.admin_client = firestore_admin_v1.FirestoreAdminClient()
        super().__init__(project=PROJECT)
        
    def find_db_by_user(self, user):
        db_id = None
        mapping = firestore.Client(project=PROJECT, database='user-to-db-mapping')
        collection_ref = mapping.collection(user.uid)
        is_collection = collection_ref.limit(1).get()
        if not is_collection:
            busy_dbs = [col.document('mapping').get().to_dict().get('db_id') for col in mapping.collections()]
            db_id = [db for db in self.get_all_dbs() if db not in busy_dbs][0]
            mapping.collection(user.uid).document('mapping').set({'db_id': db_id, 'user': user.model_dump()})
        else:
            db_id = collection_ref.document('mapping').get().to_dict().get('db_id')
        return firestore.Client(project=PROJECT, database=db_id)

    def assign_db_to_user(self, db, uid):
        user_doc = db.collection('metadata').document('user').get()
        if not user_doc.exists:
            db.collection('metadata').document('user').set({'uid': uid})
        return db

    def get_all_dbs(self):
        dbs = self.admin_client.list_databases(parent=self.parent).databases
        names = [db.name.split('/')[-1] for db in dbs]
        names = [n for n in names if len(n) == 4]
        return names

    def build_dbs(self, count=5, name_length=4, location_id="europe-west2"):
        from config import PROJECT
        admin_client = firestore_admin_v1.FirestoreAdminClient()
        created_dbs = []

        for _ in range(count):
            db_name = ''.join(random.choices(string.ascii_lowercase, k=name_length))
            database = Database(
                name=f"projects/{PROJECT}/databases/{db_name}",
                location_id=location_id,
                type_=Database.DatabaseType.FIRESTORE_NATIVE
            )
            operation = admin_client.create_database(
                parent=f"projects/{PROJECT}",
                database=database,
                database_id=db_name
            )
            operation.result()
            print('Created DB:', db_name)
            created_dbs.append(db_name)

        return created_dbs
