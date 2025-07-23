
from clients.firestore import Firestore

if __name__ == "__main__":
    firestore = Firestore()
    results = firestore.query("routine")
    print(f"Found {len(results)} documents in routine collection:")
    for doc in results:
        print(f"  - {doc['id']}: {doc}")
