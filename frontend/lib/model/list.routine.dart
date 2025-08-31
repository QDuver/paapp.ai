import 'package:flutter/material.dart';
import 'package:frontend/model/list.abstract.dart';
import 'package:frontend/model/card.routine.dart';
import 'package:json_annotation/json_annotation.dart';

part 'list.routine.g.dart';

@JsonEnum()
enum RoutineType { other, exercises, meal }

@JsonSerializable(explicitToJson: true)
class Routines extends ListAbstract<Routine> {
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  IconData icon = Icons.accessibility;
  String label = 'Routines';
  @override
  @JsonKey(defaultValue: [])
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
