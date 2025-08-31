// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'exercise.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Exercises _$ExercisesFromJson(Map<String, dynamic> json) => Exercises()
  ..collection = json['collection'] as String
  ..id = json['id'] as String
  ..items = (json['items'] as List<dynamic>)
      .map((e) => Exercise.fromJson(e as Map<String, dynamic>))
      .toList()
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

ExerciseSet _$ExerciseSetFromJson(Map<String, dynamic> json) => ExerciseSet()
  ..weightKg = (json['weightKg'] as num?)?.toDouble()
  ..repetitions = (json['repetitions'] as num?)?.toInt()
  ..durationSec = (json['durationSec'] as num?)?.toInt()
  ..rest = (json['rest'] as num).toInt();

Map<String, dynamic> _$ExerciseSetToJson(ExerciseSet instance) =>
    <String, dynamic>{
      'weightKg': instance.weightKg,
      'repetitions': instance.repetitions,
      'durationSec': instance.durationSec,
      'rest': instance.rest,
    };

Exercise _$ExerciseFromJson(Map<String, dynamic> json) => Exercise()
  ..name = json['name'] as String
  ..items = (json['items'] as List<dynamic>)
      .map((e) => ExerciseSet.fromJson(e as Map<String, dynamic>))
      .toList()
  ..isCompleted = json['isCompleted'] as bool;

Map<String, dynamic> _$ExerciseToJson(Exercise instance) => <String, dynamic>{
  'name': instance.name,
  'items': instance.items,
  'isCompleted': instance.isCompleted,
};
