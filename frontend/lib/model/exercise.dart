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
      weightKg: (json['weight_kg'] as num?)?.toDouble(),
      repetitions: json['repetitions'] as int?,
      durationSec: json['duration_sec'] as int?,
      rest: json['rest'] as int? ?? 90,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (weightKg != null) 'weight_kg': weightKg,
      if (repetitions != null) 'repetitions': repetitions,
      if (durationSec != null) 'duration_sec': durationSec,
      'rest': rest,
    };
  }
}

class Exercise {
  String name;
  List<ExerciseSet>? sets;
  int index;

  Exercise({
    required this.index,
    required this.name,
    this.sets,
  });

  factory Exercise.fromJson(Map<String, dynamic> json, int index) {
    return Exercise(
      index: index,
      name: json['name'] as String,
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
      if (sets != null) 'sets': sets!.map((e) => e.toJson()).toList(),
    };
  }
}
