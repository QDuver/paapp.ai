import 'package:frontend/model/card.abstract.dart';
import 'package:frontend/model/subcard.abstract.dart';
import 'package:frontend/model/subcard.meal.dart';
import 'package:frontend/model/utils.dart';
import 'package:json_annotation/json_annotation.dart';

part 'card.meal.g.dart';

@JsonSerializable()
class Meal extends CardAbstract {

  @JsonKey(defaultValue: [])
  List<Ingredient> items = const [];
  String instructions = '';
  int calories = 0;

  Meal();

List<String> get tags {
  return ['Calories: ${this.calories}'];
}

  @override
  List<FieldDescriptor> getEditableFields() {
    return [
      FieldDescriptor('name', 'Name', () => name, (v) => name = v, String),
      FieldDescriptor('instructions', 'Instructions', () => instructions, (v) => instructions = v, String),
      FieldDescriptor('calories', 'Calories', () => calories, (v) => calories = v ?? 0, int),
      FieldDescriptor('isCompleted', 'Completed', () => isCompleted, (v) => isCompleted = v, bool),
    ];
  }

  @override
  EditableItemAbstract createNewItem() {
    return Ingredient();
  }

  factory Meal.fromJson(Map<String, dynamic> json) => _$MealFromJson(json);

  Map<String, dynamic> toJson() => _$MealToJson(this);
}
