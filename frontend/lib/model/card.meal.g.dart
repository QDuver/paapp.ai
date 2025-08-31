// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'card.meal.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Meal _$MealFromJson(Map<String, dynamic> json) => Meal()
  ..name = json['name'] as String
  ..isCompleted = json['isCompleted'] as bool
  ..items =
      (json['items'] as List<dynamic>?)
          ?.map((e) => Ingredient.fromJson(e as Map<String, dynamic>))
          .toList() ??
      []
  ..instructions = json['instructions'] as String
  ..calories = (json['calories'] as num).toInt();

Map<String, dynamic> _$MealToJson(Meal instance) => <String, dynamic>{
  'name': instance.name,
  'isCompleted': instance.isCompleted,
  'items': instance.items,
  'instructions': instance.instructions,
  'calories': instance.calories,
};
