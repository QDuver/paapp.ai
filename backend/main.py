
import json
from clients.firestore import Firestore
from models import ExerciseDay, ExerciseSet
from quentinDuverge import generateDay

fs_old = Firestore(database='routine')
fs = Firestore(database='quentin-duverge')

if __name__ == "__main__":
    generateDay.main('Today Id like to focus on Back and Core')
   