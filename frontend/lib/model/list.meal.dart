import 'package:flutter/material.dart';
import 'package:frontend/model/list.abstract.dart';
import 'package:frontend/model/card.meal.dart';
import 'package:json_annotation/json_annotation.dart';

part 'list.meal.g.dart';

@JsonEnum()
enum MealType { breakfast, lunch, dinner }

@JsonSerializable(explicitToJson: true)
class Meals extends ListAbstract<Meal> {
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  IconData icon = Icons.restaurant;
  String label = 'Meals';
  @override
  String collection = '';

  @override
  String id = '';

  @override
  @JsonKey(defaultValue: [])
  List<Meal> items = const[];

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
