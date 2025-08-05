import 'package:frontend/model/exercise.dart';

class ExerciseDay {
  String day;
  bool atHome;
  String? wakeupTime;
  int? availableExerciseTime;
  List<Exercise> exercises;
  ExerciseDay({
    required this.day,
    this.atHome = false,
    this.wakeupTime,
    this.availableExerciseTime,
    this.exercises = const [],
  });

  factory ExerciseDay.fromJson(Map<String, dynamic> json) {
    return ExerciseDay(
      day: json['day'] as String,
      atHome: json['atHome'] as bool? ?? false,
      wakeupTime: json['wakeupTime'] as String?,
      availableExerciseTime: json['availableExerciseTime'] as int?,
      exercises: (json['exercises'] as List<dynamic>?)
              ?.map((e) => Exercise.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  static List<ExerciseDay> fromJsonList(dynamic result) {
    return result
        .map((item) => ExerciseDay.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}
