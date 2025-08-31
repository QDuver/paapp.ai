// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'routine.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Routines _$RoutinesFromJson(Map<String, dynamic> json) => Routines()
  ..collection = json['collection'] as String
  ..id = json['id'] as String
  ..items = (json['items'] as List<dynamic>)
      .map((e) => Routine.fromJson(e as Map<String, dynamic>))
      .toList()
  ..wakeupTime = json['wakeupTime'] as String?;

Map<String, dynamic> _$RoutinesToJson(Routines instance) => <String, dynamic>{
  'collection': instance.collection,
  'id': instance.id,
  'items': instance.items.map((e) => e.toJson()).toList(),
  'wakeupTime': instance.wakeupTime,
};

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
  RoutineType.meal: 'meal',
};
