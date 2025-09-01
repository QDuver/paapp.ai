import 'package:frontend/model/subcard.abstract.dart';
import 'package:frontend/model/list.exercise.dart';
import 'package:frontend/model/utils.dart';
import 'package:json_annotation/json_annotation.dart';

part 'subcard.exercise.g.dart';

@JsonSerializable()
class ExerciseSet extends SubCardAbstract {
  double? weightKg;
  int? repetitions;
  int? duration;
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
    if (duration != null) parts.add('${duration}s');
    return parts.isNotEmpty ? parts.join(' × ') : 'Set';
  }

  @override
  void updateFields(Map<String, dynamic> values, [dynamic obj]) {
    super.updateFields(values, obj);
    
    if (obj is Exercises) {
      _updateSubsequentSets(obj, values);
    }
  }

  void _updateSubsequentSets(Exercises exercises, Map<String, dynamic> values) {
    for (final exercise in exercises.items) {
      final currentIndex = exercise.items.indexOf(this);
      if (currentIndex != -1) {
        for (int i = currentIndex + 1; i < exercise.items.length; i++) {
          exercise.items[i].updateFields(values);
        }
        break;
      }
    }
  }

  @override
  List<FieldDescriptor> getEditableFields() {
    return [
      FieldDescriptor(
        'weightKg',
        'Weight (kg)',
        () => weightKg,
        (v) => weightKg = v,
        double,
      ),
      FieldDescriptor(
        'repetitions',
        'Repetitions',
        () => repetitions,
        (v) => repetitions = v,
        int,
      ),
      FieldDescriptor(
        'duration',
        'Duration (sec)',
        () => duration,
        (v) => duration = v,
        int,
      ),
      FieldDescriptor('rest', 'Rest', () => rest, (v) => rest = v ?? 90, int),
    ];
  }
}
