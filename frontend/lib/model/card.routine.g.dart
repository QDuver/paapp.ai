// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'card.routine.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Routine _$RoutineFromJson(Map<String, dynamic> json) => Routine()
  ..name = json['name'] as String
  ..isCompleted = json['isCompleted'] as bool? ?? false
  ..durationMin = (json['durationMin'] as num?)?.toInt()
  ..routineType =
      $enumDecodeNullable(_$RoutineTypeEnumMap, json['routineType']) ??
      RoutineType.other
  ..ref = json['ref'];

Map<String, dynamic> _$RoutineToJson(Routine instance) => <String, dynamic>{
  'name': instance.name,
  'isCompleted': instance.isCompleted,
  'durationMin': instance.durationMin,
  'routineType': _$RoutineTypeEnumMap[instance.routineType]!,
  'ref': instance.ref,
};

const _$RoutineTypeEnumMap = {
  RoutineType.other: 'other',
  RoutineType.exercises: 'exercises',
  RoutineType.meals: 'meals',
};
