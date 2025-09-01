// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subcard.exercise.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExerciseSet _$ExerciseSetFromJson(Map<String, dynamic> json) => ExerciseSet()
  ..weightKg = (json['weightKg'] as num?)?.toDouble()
  ..repetitions = (json['repetitions'] as num?)?.toInt()
  ..duration = (json['duration'] as num?)?.toInt()
  ..rest = (json['rest'] as num).toInt();

Map<String, dynamic> _$ExerciseSetToJson(ExerciseSet instance) =>
    <String, dynamic>{
      'weightKg': instance.weightKg,
      'repetitions': instance.repetitions,
      'duration': instance.duration,
      'rest': instance.rest,
    };
