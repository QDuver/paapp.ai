// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subcard.meal.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

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
