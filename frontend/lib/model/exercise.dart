import 'package:flutter/material.dart';
import 'package:frontend/model/abstracts.dart';
import 'package:json_annotation/json_annotation.dart';

part 'exercise.g.dart';

@JsonSerializable(explicitToJson: true)
class Exercises extends ListAbstract<Exercise> {
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  IconData icon = Icons.fitness_center;
  @override
  List<Exercise> items = const [];
  bool? atHome;
  int? availableTimeMin;
  String? notes;

  Exercises();

  factory Exercises.fromJson(Map<String, dynamic> json) =>
      _$ExercisesFromJson(json);
  Map<String, dynamic> toJson() => _$ExercisesToJson(this);
  
  @override
  Exercise createNewItem() {
    return Exercise()..name = '';
  }
}

@JsonSerializable()
class ExerciseSet extends SubCardAbstract {
  double? weightKg;
  int? repetitions;
  int? durationSec;
  int rest = 90;
  ExerciseSet();

  factory ExerciseSet.fromJson(Map<String, dynamic> json) =>
      _$ExerciseSetFromJson(json);
  Map<String, dynamic> toJson() => _$ExerciseSetToJson(this);

  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  String get name {
    List<String> parts = [];
    if (weightKg != null) parts.add('${weightKg}kg');
    if (repetitions != null) parts.add('${repetitions} reps');
    if (durationSec != null) parts.add('${durationSec}s');
    return parts.isNotEmpty ? parts.join(' × ') : 'Set';
  }


  List<FieldDescriptor> getEditableFields() {
    return [
      FieldDescriptor('weightKg', 'Weight (kg)', () => weightKg, (v) => weightKg = v, double),
      FieldDescriptor('repetitions', 'Repetitions', () => repetitions, (v) => repetitions = v, int),
      FieldDescriptor('durationSec', 'Duration (sec)', () => durationSec, (v) => durationSec = v, int),
      FieldDescriptor('rest', 'Rest', () => rest, (v) => rest = v ?? 90, int),
    ];
  }
}

@JsonSerializable()
class Exercise extends CardAbstract {

  List<ExerciseSet> items = const [];
  Exercise();

  factory Exercise.fromJson(Map<String, dynamic> json) => _$ExerciseFromJson(json);
  Map<String, dynamic> toJson() => _$ExerciseToJson(this);


  @override
  List<FieldDescriptor> getEditableFields() {
    return [
      FieldDescriptor('name', 'Name', () => name, (v) => name = v, String),
      FieldDescriptor('isCompleted', 'Completed', () => isCompleted, (v) => isCompleted = v, bool),
    ];
  }

  @override
  EditableItemAbstract createNewItem() {
    return ExerciseSet();
  }
}
