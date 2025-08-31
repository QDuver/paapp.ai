import 'package:flutter/material.dart';
import 'package:frontend/model/abstracts.dart';
import 'package:json_annotation/json_annotation.dart';

part 'routine.g.dart';

@JsonEnum()
enum RoutineType { other, exercises, meal }

@JsonSerializable(explicitToJson: true)
class Routines implements ListAbstract<Routine> {
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  IconData icon = Icons.inbox_outlined;

  @override
  String collection = '';

  @override
  String id = '';

  @override
  List<Routine> items = const <Routine>[];

  String? wakeupTime;

  Routines();

  factory Routines.fromJson(Map<String, dynamic> json) => _$RoutinesFromJson(json);
  Map<String, dynamic> toJson() => _$RoutinesToJson(this);
  
  @override
  Routine createNewItem() {
    return Routine()..name = '';
  }

}

@JsonSerializable()
class Routine extends CardAbstract {
  String name = '';
  
  @JsonKey(defaultValue: false, includeFromJson: false, includeToJson: false)
  bool isExpanded = false;
  
  @JsonKey(defaultValue: false)
  bool isCompleted = false;
  
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  bool canAddItems = false;
  
  int? durationMin;
  
  @JsonKey(defaultValue: RoutineType.other)
  RoutineType routineType = RoutineType.other;
  
  dynamic ref;

  Routine();

  factory Routine.fromJson(Map<String, dynamic> json) => _$RoutineFromJson(json);
  Map<String, dynamic> toJson() => _$RoutineToJson(this);



  @override
  List<FieldDescriptor> getEditableFields() {
    return [
      FieldDescriptor('name', 'Name', () => name, (v) => name = v, String),
      FieldDescriptor('durationMin', 'Duration (min)', () => durationMin, (v) => durationMin = v, int),
      FieldDescriptor('routineType', 'Routine Type', () => routineType.name, (v) => routineType = RoutineType.values.byName(v), String),
      FieldDescriptor('isCompleted', 'Completed', () => isCompleted, (v) => isCompleted = v, bool),
    ];
  }

}
