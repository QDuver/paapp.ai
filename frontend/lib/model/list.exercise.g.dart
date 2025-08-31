// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list.exercise.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Exercises _$ExercisesFromJson(Map<String, dynamic> json) => Exercises()
  ..collection = json['collection'] as String
  ..id = json['id'] as String
  ..items =
      (json['items'] as List<dynamic>?)
          ?.map((e) => Exercise.fromJson(e as Map<String, dynamic>))
          .toList() ??
      []
  ..atHome = json['atHome'] as bool?
  ..availableTimeMin = (json['availableTimeMin'] as num?)?.toInt()
  ..notes = json['notes'] as String?;

Map<String, dynamic> _$ExercisesToJson(Exercises instance) => <String, dynamic>{
  'collection': instance.collection,
  'id': instance.id,
  'items': instance.items.map((e) => e.toJson()).toList(),
  'atHome': instance.atHome,
  'availableTimeMin': instance.availableTimeMin,
  'notes': instance.notes,
};
