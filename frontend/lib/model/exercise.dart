
class Exercise {
  String name;
  double? weightKg;
  int? repetitions;
  int? durationSec;
  int rest;
  Exercise({ required this.name, this.weightKg, this.repetitions, this.durationSec, this.rest = 90, });

  factory Exercise.fromJson(Map<String, dynamic> json) {
    return Exercise(
      name: json['name'] as String,
      weightKg: (json['weightKg'] as num?)?.toDouble(),
      repetitions: json['repetitions'] as int?,
      durationSec: json['durationSec'] as int?,
      rest: json['rest'] as int? ?? 90,
    );
  }

}
