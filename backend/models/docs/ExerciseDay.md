# ExerciseDay


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**var_date** | **date** |  | 
**exercises** | [**List[Exercise]**](Exercise.md) |  | 

## Example

```python
from models.models.exercise_day import ExerciseDay

# TODO update the JSON string below
json = "{}"
# create an instance of ExerciseDay from a JSON string
exercise_day_instance = ExerciseDay.from_json(json)
# print the JSON string representation of the object
print(ExerciseDay.to_json())

# convert the object into a dict
exercise_day_dict = exercise_day_instance.to_dict()
# create an instance of ExerciseDay from a dict
exercise_day_from_dict = ExerciseDay.from_dict(exercise_day_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


