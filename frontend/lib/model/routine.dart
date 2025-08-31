import 'package:flutter/material.dart';
import 'package:frontend/components/card/abstracts.dart';
import 'package:json_annotation/json_annotation.dart';

part 'routine.g.dart';

@JsonEnum()
enum RoutineType { other, exercises, meal }

@JsonSerializable(explicitToJson: true)
class Routines implements MetaAbstract<Routine> {
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  IconData icon = Icons.inbox_outlined;

  @override
  String collection;

  @override
  String id;

  @override
  List<Routine> items;

  String? wakeupTime;

  Routines({
    this.collection = '',
    this.id = '',
    this.items = const <Routine>[],
    this.wakeupTime,
  });

  factory Routines.fromJson(Map<String, dynamic> json) => _$RoutinesFromJson(json);
  Map<String, dynamic> toJson() => _$RoutinesToJson(this);

}

@JsonSerializable()
class Routine extends CardAbstract {
  String name;
  
  @JsonKey(defaultValue: false, includeToJson: false)
  bool isExpanded;
  
  @JsonKey(defaultValue: false)
  bool isCompleted;
  
  int? durationMin;
  
  @JsonKey(defaultValue: RoutineType.other)
  RoutineType routineType;
  
  dynamic ref;

  Routine({
    required this.name,
    this.isExpanded = false,
    this.isCompleted = false,
    this.durationMin = 0,
    this.routineType = RoutineType.other,
    this.ref,
  });

  factory Routine.fromJson(Map<String, dynamic> json) => _$RoutineFromJson(json);
  Map<String, dynamic> toJson() => _$RoutineToJson(this);



  @override
  void updateFields(Map<String, dynamic> values) {
    updateFieldsHelper<String>(values, 'name', (value) => name = value);
    updateFieldsHelper<bool>(values, 'isCompleted', (value) => isCompleted = value);
    updateFieldsHelper<String>(values, 'durationMin', (value) => durationMin = int.tryParse(value));
    updateFieldsHelper<String>(values, 'routineType', (value) => routineType = RoutineType.values.byName(value));
  }

  @override
  List<FieldInfo> getEditableFields() {
    return [
      FieldInfo(
        name: 'name',
        label: 'Routine Name',
        value: name,
        required: true,
      ),
      FieldInfo(
        name: 'durationMin',
        label: 'Duration (minutes)',
        value: durationMin,
        type: int,
      ),
      FieldInfo(
        name: 'routineType',
        label: 'Type',
        value: routineType.name,
      ),
    ];
  }

}
