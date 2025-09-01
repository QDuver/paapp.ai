import 'package:flutter/material.dart';
import 'package:frontend/model/list.abstract.dart';
import 'package:frontend/model/card.exercise.dart';
import 'package:json_annotation/json_annotation.dart';

part 'list.exercise.g.dart';

@JsonSerializable(explicitToJson: true)
class Exercises extends ListAbstract<Exercise> {
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  IconData icon = Icons.fitness_center;
  String label = 'Exercises';
  @override
  @JsonKey(defaultValue: [])
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
