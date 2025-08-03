# Exercise


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**weight_kg** | **float** |  | [optional] 
**repetitions** | **int** |  | [optional] 
**duration_sec** | **int** |  | [optional] 
**rest** | **int** |  | [optional] [default to 90]

## Example

```python
from models.models.exercise import Exercise

# TODO update the JSON string below
json = "{}"
# create an instance of Exercise from a JSON string
exercise_instance = Exercise.from_json(json)
# print the JSON string representation of the object
print(Exercise.to_json())

# convert the object into a dict
exercise_dict = exercise_instance.to_dict()
# create an instance of Exercise from a dict
exercise_from_dict = Exercise.from_dict(exercise_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


