class ExerciseSet {
  double? weightKg;
  int? repetitions;
  int? durationSec;
  int? rest;

  ExerciseSet({
    this.weightKg,
    this.repetitions,
    this.durationSec,
    this.rest = 90,
  });

  factory ExerciseSet.fromJson(Map<String, dynamic> json) {
    return ExerciseSet(
      weightKg: (json['weightKg'] as num?)?.toDouble(),
      repetitions: json['repetitions'] as int?,
      durationSec: json['duration'] as int?,
      rest: json['rest'] as int? ?? 90,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (weightKg != null) 'weightKg': weightKg,
      if (repetitions != null) 'repetitions': repetitions,
      if (durationSec != null) 'duration': durationSec,
      'rest': rest,
    };
  }
}

class Exercise {
  String name;
  List<ExerciseSet>? sets;
  int index;
  bool isCompleted;

  Exercise({
    required this.index,
    required this.name,
    this.sets,
    this.isCompleted = false,
  });

  factory Exercise.fromJson(Map<String, dynamic> json, int index) {
    return Exercise(
      index: index,
      name: json['name'] as String,
      isCompleted: json['isCompleted'] as bool? ?? false,
      sets: json['sets'] != null
          ? (json['sets'] as List<dynamic>)
              .map((e) => ExerciseSet.fromJson(e as Map<String, dynamic>))
              .toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'isCompleted': isCompleted,
      if (sets != null) 'sets': sets!.map((e) => e.toJson()).toList(),
    };
  }

}
