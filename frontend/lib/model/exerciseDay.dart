import 'package:frontend/model/exercise.dart';
import 'package:frontend/apiService.dart';

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
              ?.asMap()
              .entries
              .map((entry) => Exercise.fromJson(
                  entry.value as Map<String, dynamic>, entry.key))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'atHome': atHome,
      if (wakeupTime != null) 'wakeupTime': wakeupTime,
      if (availableExerciseTime != null)
        'availableExerciseTime': availableExerciseTime,
      'exercises': exercises.map((e) => e.toJson()).toList(),
    };
  }

  static List<ExerciseDay> fromJsonList(dynamic result) {
    return (result as List<dynamic>)
        .map((item) => ExerciseDay.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<void> updateExerciseAtIndex(
      int index, Exercise updatedExercise) async {
    await ApiService.request(
      'update-db/exercises/$day',
      'POST',
      payload: {
        'path': ['exercises', index],
        'value': updatedExercise.toJson(),
      },
    );

    exercises[index] = updatedExercise;
  }

  Future<void> updateDb() async {
    print(this.toJson());
    await ApiService.request(
      'quentin-duverge/exercises/$day',
      'POST',
      payload: this.toJson(),
    );
  }
}
