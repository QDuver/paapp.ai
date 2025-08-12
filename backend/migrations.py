from google.cloud import firestore

fs = firestore.Client(database='quentin-duverge')
exercises_ref = fs.collection('exercises')
exercises = exercises_ref.get()

for exercise_doc in exercises:
    exerciseDay = exercise_doc.to_dict()
    for exercise in exerciseDay.get('exercises', []):
        # print(f"Exercise Name: {exercise.get('name')}")
        # print(f"Is Completed: {exercise.get('isCompleted', False)}")
        exercise['isCompleted'] = exercise.get('isCompleted', False)
        # print(exercise)
    print(exerciseDay)
    fs.collection('exercises').document(exercise_doc.id).set(exerciseDay)
    print('-----------')