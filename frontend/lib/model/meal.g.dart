// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'meal.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Meals _$MealsFromJson(Map<String, dynamic> json) => Meals()
  ..collection = json['collection'] as String
  ..id = json['id'] as String
  ..items = (json['items'] as List<dynamic>)
      .map((e) => Meal.fromJson(e as Map<String, dynamic>))
      .toList()
  ..atHome = json['atHome'] as bool?
  ..availableTimeMin = (json['availableTimeMin'] as num?)?.toInt()
  ..notes = json['notes'] as String?;

Map<String, dynamic> _$MealsToJson(Meals instance) => <String, dynamic>{
  'collection': instance.collection,
  'id': instance.id,
  'items': instance.items.map((e) => e.toJson()).toList(),
  'atHome': instance.atHome,
  'availableTimeMin': instance.availableTimeMin,
  'notes': instance.notes,
};

Ingredient _$IngredientFromJson(Map<String, dynamic> json) => Ingredient()
  ..name = json['name'] as String
  ..quantity = (json['quantity'] as num).toDouble()
  ..calories = (json['calories'] as num).toInt()
  ..isExpanded = json['isExpanded'] as bool? ?? false;

Map<String, dynamic> _$IngredientToJson(Ingredient instance) =>
    <String, dynamic>{
      'name': instance.name,
      'quantity': instance.quantity,
      'calories': instance.calories,
    };

Meal _$MealFromJson(Map<String, dynamic> json) => Meal()
  ..name = json['name'] as String
  ..isCompleted = json['isCompleted'] as bool
  ..items = (json['items'] as List<dynamic>)
      .map((e) => Ingredient.fromJson(e as Map<String, dynamic>))
      .toList()
  ..instructions = json['instructions'] as String
  ..calories = (json['calories'] as num).toInt();

Map<String, dynamic> _$MealToJson(Meal instance) => <String, dynamic>{
  'name': instance.name,
  'isCompleted': instance.isCompleted,
  'items': instance.items,
  'instructions': instance.instructions,
  'calories': instance.calories,
};
