import 'package:frontend/model/abstracts.dart';
import 'package:json_annotation/json_annotation.dart';

part 'meal.g.dart';

@JsonEnum()
enum MealType { breakfast, lunch, dinner }


@JsonSerializable()
class Meal extends CardAbstract {

  String name;
  List<String>? ingredients;
  String? instructions;
  int? calories;
  @JsonKey(defaultValue: false)
  bool isCompleted;
  @JsonKey(defaultValue: false, includeToJson: false)
  bool isExpanded;

  Meal({
    required this.name,
    this.ingredients,
    this.instructions,
    this.calories,
    this.isCompleted = false,
    this.isExpanded = false,
  });


  void setCompletionStatus(bool completed) {
    isCompleted = completed;
  }

  @override
  List<FieldInfo> getEditableFields() {
    return [
      FieldInfo(
        name: 'name',
        label: 'Meal Name',
        value: name,
        required: true,
      ),
      FieldInfo(
        name: 'instructions',
        label: 'Instructions',
        value: instructions,
      ),
      FieldInfo(
        name: 'calories',
        label: 'Calories',
        value: calories,
        type: int,
      ),
    ];
  }

  @override
  void updateFields(Map<String, dynamic> values) {
    updateFieldsHelper<String>(values, 'name', (value) => name = value);
    updateFieldsHelper<bool>(values, 'isCompleted', (value) => isCompleted = value);
    updateFieldsHelper(values, 'instructions', (value) => instructions = value?.toString());
    updateFieldsHelper<String>(values, 'calories', (value) => calories = int.tryParse(value));
  }

  factory Meal.fromJson(Map<String, dynamic> json) => _$MealFromJson(json);

  Map<String, dynamic> toJson() => _$MealToJson(this);


}