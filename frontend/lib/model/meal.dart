import 'package:flutter/material.dart';
import 'package:frontend/model/abstracts.dart';
import 'package:json_annotation/json_annotation.dart';

part 'meal.g.dart';

@JsonEnum()
enum MealType { breakfast, lunch, dinner }

@JsonSerializable(explicitToJson: true)
class Meals implements ListAbstract<Meal> {
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  IconData icon = Icons.restaurant;

  @override
  String collection = '';

  @override
  String id = '';

  @override
  List<Meal> items = const [];

  bool? atHome;
  int? availableTimeMin;
  String? notes;

  Meals();

  factory Meals.fromJson(Map<String, dynamic> json) =>
      _$MealsFromJson(json);
  Map<String, dynamic> toJson() => _$MealsToJson(this);
  
  @override
  Meal createNewItem() {
    return Meal()..name = '';
  }
}

@JsonSerializable()
class Ingredient extends SubCardAbstract {
  String name = '';
  
  double quantity = 0.0;
  
  int calories = 0;

  @JsonKey(defaultValue: false, includeToJson: false)
  bool isExpanded = false;

  Ingredient();

  factory Ingredient.fromJson(Map<String, dynamic> json) =>
      _$IngredientFromJson(json);
  Map<String, dynamic> toJson() => _$IngredientToJson(this);

  @override
  List<FieldDescriptor> getEditableFields() {
    return [
      FieldDescriptor('name', 'Name', () => name, (v) => name = v, String),
      FieldDescriptor('quantity', 'Quantity', () => quantity, (v) => quantity = v ?? 0.0, double),
      FieldDescriptor('calories', 'Calories', () => calories, (v) => calories = v ?? 0, int),
    ];
  }
}

@JsonSerializable()
class Meal extends CardAbstract {

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