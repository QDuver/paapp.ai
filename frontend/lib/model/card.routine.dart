import 'package:frontend/model/card.abstract.dart';
import 'package:frontend/model/subcard.abstract.dart';
import 'package:frontend/model/list.routine.dart';
import 'package:frontend/model/utils.dart';
import 'package:json_annotation/json_annotation.dart';

part 'card.routine.g.dart';

@JsonSerializable()
class Routine extends CardAbstract {
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
