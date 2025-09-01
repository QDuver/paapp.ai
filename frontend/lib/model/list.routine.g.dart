// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'list.routine.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Routines _$RoutinesFromJson(Map<String, dynamic> json) => Routines()
  ..collection = json['collection'] as String
  ..id = json['id'] as String
  ..items =
      (json['items'] as List<dynamic>?)
          ?.map((e) => Routine.fromJson(e as Map<String, dynamic>))
          .toList() ??
      []
  ..wakeupTime = json['wakeupTime'] as String?;

Map<String, dynamic> _$RoutinesToJson(Routines instance) => <String, dynamic>{
  'collection': instance.collection,
  'id': instance.id,
  'items': instance.items.map((e) => e.toJson()).toList(),
  'wakeupTime': instance.wakeupTime,
};
