//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of workout_api_models.api;

class ExerciseDay {
  /// Returns a new [ExerciseDay] instance.
  ExerciseDay({
    required this.day,
    this.atHome = false,
    this.wakeupTime,
    this.availableExerciseTime,
    this.exercises = const [],
  });

  String day;

  bool atHome;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  String? wakeupTime;

  /// Total available time for exercise in minutes
  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? availableExerciseTime;

  List<Exercise> exercises;

  @override
  bool operator ==(Object other) => identical(this, other) || other is ExerciseDay &&
    other.day == day &&
    other.atHome == atHome &&
    other.wakeupTime == wakeupTime &&
    other.availableExerciseTime == availableExerciseTime &&
    _deepEquality.equals(other.exercises, exercises);

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (day.hashCode) +
    (atHome.hashCode) +
    (wakeupTime == null ? 0 : wakeupTime!.hashCode) +
    (availableExerciseTime == null ? 0 : availableExerciseTime!.hashCode) +
    (exercises.hashCode);

  @override
  String toString() => 'ExerciseDay[day=$day, atHome=$atHome, wakeupTime=$wakeupTime, availableExerciseTime=$availableExerciseTime, exercises=$exercises]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'day'] = this.day;
      json[r'at_home'] = this.atHome;
    if (this.wakeupTime != null) {
      json[r'wakeup_time'] = this.wakeupTime;
    } else {
      json[r'wakeup_time'] = null;
    }
    if (this.availableExerciseTime != null) {
      json[r'available_exercise_time'] = this.availableExerciseTime;
    } else {
      json[r'available_exercise_time'] = null;
    }
      json[r'exercises'] = this.exercises;
    return json;
  }

  /// Returns a new [ExerciseDay] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static ExerciseDay? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "ExerciseDay[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "ExerciseDay[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return ExerciseDay(
        day: mapValueOfType<String>(json, r'day')!,
        atHome: mapValueOfType<bool>(json, r'at_home') ?? false,
        wakeupTime: mapValueOfType<String>(json, r'wakeup_time'),
        availableExerciseTime: mapValueOfType<int>(json, r'available_exercise_time'),
        exercises: Exercise.listFromJson(json[r'exercises']),
      );
    }
    return null;
  }

  static List<ExerciseDay> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <ExerciseDay>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = ExerciseDay.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, ExerciseDay> mapFromJson(dynamic json) {
    final map = <String, ExerciseDay>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = ExerciseDay.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of ExerciseDay-objects as value to a dart map
  static Map<String, List<ExerciseDay>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<ExerciseDay>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = ExerciseDay.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'day',
  };
}

