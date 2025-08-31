// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'meal.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Meal _$MealFromJson(Map<String, dynamic> json) => Meal(
  name: json['name'] as String,
  ingredients: (json['ingredients'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  instructions: json['instructions'] as String?,
  calories: (json['calories'] as num?)?.toInt(),
  isCompleted: json['isCompleted'] as bool? ?? false,
  isExpanded: json['isExpanded'] as bool? ?? false,
);

Map<String, dynamic> _$MealToJson(Meal instance) => <String, dynamic>{
  'name': instance.name,
  'ingredients': instance.ingredients,
  'instructions': instance.instructions,
  'calories': instance.calories,
  'isCompleted': instance.isCompleted,
};
