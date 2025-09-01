// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list.meal.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Meals _$MealsFromJson(Map<String, dynamic> json) => Meals()
  ..collection = json['collection'] as String
  ..id = json['id'] as String
  ..items =
      (json['items'] as List<dynamic>?)
          ?.map((e) => Meal.fromJson(e as Map<String, dynamic>))
          .toList() ??
      []
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
