import 'package:flutter/material.dart';
import 'package:frontend/model/abstracts.dart';
import 'package:json_annotation/json_annotation.dart';

part 'exercise.g.dart';

@JsonSerializable(explicitToJson: true)
class Exercises implements MetaAbstract<Exercise> {
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  IconData icon = Icons.fitness_center;

  @override
  String collection;

  @override
  String id;

  @override
  List<Exercise> items;

  bool? atHome;
  int? availableTimeMin;
  String? notes;

  Exercises({
    this.collection = '',
    this.id = '',
    List<Exercise>? items,
    this.atHome,
    this.availableTimeMin,
    this.notes,
  }) : items = items ?? [];

  factory Exercises.fromJson(Map<String, dynamic> json) =>
      _$ExercisesFromJson(json);
  Map<String, dynamic> toJson() => _$ExercisesToJson(this);
  
  @override
  Exercise createNewItem() {
    return Exercise(name: '');
  }
}

@JsonSerializable()
class ExerciseSet extends SubCardAbstract {
  @JsonKey(name: 'weightKg')
  double? weightKg;

  int? repetitions;

  @JsonKey(name: 'duration')
  int? durationSec;

  @JsonKey(defaultValue: 90)
  int rest;

  @JsonKey(defaultValue: false, includeToJson: false)
  bool isExpanded;

  ExerciseSet({
    this.weightKg,
    this.repetitions,
    this.durationSec,
    this.rest = 90,
    this.isExpanded = false,
  });

  factory ExerciseSet.fromJson(Map<String, dynamic> json) =>
      _$ExerciseSetFromJson(json);
  Map<String, dynamic> toJson() => _$ExerciseSetToJson(this);

  String get name {
    List<String> parts = [];
    if (weightKg != null) parts.add('${weightKg}kg');
    if (repetitions != null) parts.add('${repetitions} reps');
    if (durationSec != null) parts.add('${durationSec}s');
    return parts.isNotEmpty ? parts.join(' × ') : 'Set';
  }

  List<FieldInfo> getEditableFields() {
    return [
      FieldInfo(
        name: 'weightKg',
        label: 'Weight (kg)',
        value: weightKg,
        type: double,
      ),
      FieldInfo(
        name: 'repetitions',
        label: 'Repetitions',
        value: repetitions,
        type: int,
      ),
      FieldInfo(
        name: 'durationSec',
        label: 'Duration (sec)',
        value: durationSec,
        type: int,
      ),
      FieldInfo(name: 'rest', label: 'Rest (sec)', value: rest, type: int),
    ];
  }

  void updateFields(Map<String, dynamic> values) {
    updateFieldsHelper<String>(values, 'weightKg', (value) => weightKg = double.tryParse(value));
    updateFieldsHelper<String>(values, 'repetitions', (value) => repetitions = int.tryParse(value));
    updateFieldsHelper<String>(values, 'durationSec', (value) => durationSec = int.tryParse(value));
    updateFieldsHelper<String>(values, 'rest', (value) => rest = int.tryParse(value) ?? 90);
  }
}

@JsonSerializable()
class Exercise extends CardAbstract {
  @JsonKey(defaultValue: false, includeToJson: false)
  bool isExpanded;
  String name;
  List<ExerciseSet>? items;
  @JsonKey(defaultValue: false)
  bool isCompleted;

  Exercise({
    required this.name,
    this.items,
    this.isCompleted = false,
    this.isExpanded = false,
  });

  factory Exercise.fromJson(Map<String, dynamic> json) =>
      _$ExerciseFromJson(json);
  Map<String, dynamic> toJson() => _$ExerciseToJson(this);

  @override
  List<FieldInfo> getEditableFields() {
    return [
      FieldInfo(
        name: 'name',
        label: 'Exercise Name',
        value: name,
        required: true,
      ),
    ];
  }

  @override
  void updateFields(Map<String, dynamic> values) {
    updateFieldsHelper<String>(values, 'name', (value) => name = value);
    updateFieldsHelper<bool>(
      values,
      'isCompleted',
      (value) => isCompleted = value,
    );
  }

  @override
  EditableItem createNewItem() {
    return ExerciseSet();
  }
}
