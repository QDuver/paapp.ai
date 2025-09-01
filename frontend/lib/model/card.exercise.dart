import 'package:frontend/model/card.abstract.dart';
import 'package:frontend/model/subcard.abstract.dart';
import 'package:frontend/model/subcard.exercise.dart';
import 'package:frontend/model/utils.dart';
import 'package:json_annotation/json_annotation.dart';

part 'card.exercise.g.dart';
@JsonSerializable()
class Exercise extends CardAbstract {
  @JsonKey(defaultValue: [])
  List<ExerciseSet> items = [];

  Exercise();

  factory Exercise.fromJson(Map<String, dynamic> json) =>
      _$ExerciseFromJson(json);
  Map<String, dynamic> toJson() => _$ExerciseToJson(this);

  @override
  List<FieldDescriptor> getEditableFields() {
    return [
      FieldDescriptor('name', 'Name', () => name, (v) => name = v, String),
      FieldDescriptor(
        'isCompleted',
        'Completed',
        () => isCompleted,
        (v) => isCompleted = v,
        bool,
      ),
    ];
  }

  @override
  EditableItemAbstract createNewItem() {
    return ExerciseSet();
  }
}
