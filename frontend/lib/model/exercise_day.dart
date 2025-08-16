import 'package:frontend/model/exercise.dart';
import 'package:frontend/api.dart';

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
              .map((entry) => _exerciseFromJson(
                  entry.value as Map<String, dynamic>, entry.key))
              .toList() ??
          [],
    );
  }

  static Exercise _exerciseFromJson(Map<String, dynamic> json, int index) {
    return Exercise(
      index: index,
      name: json['name'] as String,
      isCompleted: json['isCompleted'] as bool? ?? false,
      sets: json['sets'] != null
          ? (json['sets'] as List<dynamic>)
              .map((e) => _exerciseSetFromJson(e as Map<String, dynamic>))
              .toList()
          : null,
    );
  }

  static ExerciseSet _exerciseSetFromJson(Map<String, dynamic> json) {
    return ExerciseSet(
      weightKg: (json['weightKg'] as num?)?.toDouble(),
      repetitions: json['repetitions'] as int?,
      durationSec: json['duration'] as int?,
      rest: json['rest'] as int? ?? 90,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'atHome': atHome,
      if (wakeupTime != null) 'wakeupTime': wakeupTime,
      if (availableExerciseTime != null)
        'availableExerciseTime': availableExerciseTime,
      'exercises': exercises.map((e) => _exerciseToJson(e)).toList(),
    };
  }

  static Map<String, dynamic> _exerciseToJson(Exercise exercise) {
    return {
      'name': exercise.name,
      'isCompleted': exercise.isCompleted,
      if (exercise.sets != null) 'sets': exercise.sets!.map((e) => _exerciseSetToJson(e)).toList(),
    };
  }

  static Map<String, dynamic> _exerciseSetToJson(ExerciseSet set) {
    return {
      if (set.weightKg != null) 'weightKg': set.weightKg,
      if (set.repetitions != null) 'repetitions': set.repetitions,
      if (set.durationSec != null) 'duration': set.durationSec,
      'rest': set.rest,
    };
  }

  static List<ExerciseDay> fromJsonList(dynamic result) {
    return (result as List<dynamic>)
        .map((item) => ExerciseDay.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<void> updateDb() async {
    await ApiService.request(
      'quentin-duverge/exercises/$day',
      'POST',
      payload: this.toJson(),
    );
  }
}
