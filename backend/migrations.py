#  data = fs_old.query(collection='routine')
#     exerciseDay = [x for x in data if x['day'] == '2025-08-05'][0]
#     for exercise in exerciseDay['exercises']:
#         exercise['sets'] = [{"repetitions": exercise['repetitions'], "weight_kg": exercise['weight_kg'], "duration_sec": exercise['duration_sec'] if 'duration_sec' in exercise else None, "rest": exercise['rest'] if 'rest' in exercise else None}]
#         exercise.pop('repetitions', None)
#         exercise.pop('weight_kg', None)
#         exercise.pop('duration_sec', None)
#         exercise.pop('rest', None)
        
#     # remove the duplicate exercises based on name
#     unique_exercises = {}
#     for exercise in exerciseDay['exercises']:
#         if exercise['name'] not in unique_exercises:
#             unique_exercises[exercise['name']] = exercise
#         else:
#             unique_exercises[exercise['name']]['sets'].extend(exercise['sets'])
            
#     exerciseDay['exercises'] = list(unique_exercises.values())
        
#     exerciseDay = ExerciseDay(**exerciseDay)
    
#     print(json.dumps(exerciseDay.model_dump(), indent=2))
    
    
    
#     # exerciseDay = ExerciseDay(**data[0])
    
#     # fs.delete(collection='exercises', doc_id='2025-08-05')
#     # print(data)
#     fs.insert(collection='exercises', data=exerciseDay.model_dump(), doc_id='2025-08-05')