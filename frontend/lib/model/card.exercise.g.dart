// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'card.exercise.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Exercise _$ExerciseFromJson(Map<String, dynamic> json) => Exercise()
  ..name = json['name'] as String
  ..isCompleted = json['isCompleted'] as bool
  ..items =
      (json['items'] as List<dynamic>?)
          ?.map((e) => ExerciseSet.fromJson(e as Map<String, dynamic>))
          .toList() ??
      [];

Map<String, dynamic> _$ExerciseToJson(Exercise instance) => <String, dynamic>{
  'name': instance.name,
  'isCompleted': instance.isCompleted,
  'items': instance.items,
};
