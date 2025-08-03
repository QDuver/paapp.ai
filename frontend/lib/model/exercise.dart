//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//
// @dart=2.18

// ignore_for_file: unused_element, unused_import
// ignore_for_file: always_put_required_named_parameters_first
// ignore_for_file: constant_identifier_names
// ignore_for_file: lines_longer_than_80_chars

part of workout_api_models.api;

class Exercise {
  /// Returns a new [Exercise] instance.
  Exercise({
    required this.name,
    this.weightKg,
    this.repetitions,
    this.durationSec,
    this.rest = 90,
  });

  String name;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  double? weightKg;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? repetitions;

  ///
  /// Please note: This property should have been non-nullable! Since the specification file
  /// does not include a default value (using the "default:" property), however, the generated
  /// source code must fall back to having a nullable type.
  /// Consider adding a "default:" property in the specification file to hide this note.
  ///
  int? durationSec;

  int rest;

  @override
  bool operator ==(Object other) => identical(this, other) || other is Exercise &&
    other.name == name &&
    other.weightKg == weightKg &&
    other.repetitions == repetitions &&
    other.durationSec == durationSec &&
    other.rest == rest;

  @override
  int get hashCode =>
    // ignore: unnecessary_parenthesis
    (name.hashCode) +
    (weightKg == null ? 0 : weightKg!.hashCode) +
    (repetitions == null ? 0 : repetitions!.hashCode) +
    (durationSec == null ? 0 : durationSec!.hashCode) +
    (rest.hashCode);

  @override
  String toString() => 'Exercise[name=$name, weightKg=$weightKg, repetitions=$repetitions, durationSec=$durationSec, rest=$rest]';

  Map<String, dynamic> toJson() {
    final json = <String, dynamic>{};
      json[r'name'] = this.name;
    if (this.weightKg != null) {
      json[r'weight_kg'] = this.weightKg;
    } else {
      json[r'weight_kg'] = null;
    }
    if (this.repetitions != null) {
      json[r'repetitions'] = this.repetitions;
    } else {
      json[r'repetitions'] = null;
    }
    if (this.durationSec != null) {
      json[r'duration_sec'] = this.durationSec;
    } else {
      json[r'duration_sec'] = null;
    }
      json[r'rest'] = this.rest;
    return json;
  }

  /// Returns a new [Exercise] instance and imports its values from
  /// [value] if it's a [Map], null otherwise.
  // ignore: prefer_constructors_over_static_methods
  static Exercise? fromJson(dynamic value) {
    if (value is Map) {
      final json = value.cast<String, dynamic>();

      // Ensure that the map contains the required keys.
      // Note 1: the values aren't checked for validity beyond being non-null.
      // Note 2: this code is stripped in release mode!
      assert(() {
        requiredKeys.forEach((key) {
          assert(json.containsKey(key), 'Required key "Exercise[$key]" is missing from JSON.');
          assert(json[key] != null, 'Required key "Exercise[$key]" has a null value in JSON.');
        });
        return true;
      }());

      return Exercise(
        name: mapValueOfType<String>(json, r'name')!,
        weightKg: mapValueOfType<double>(json, r'weight_kg'),
        repetitions: mapValueOfType<int>(json, r'repetitions'),
        durationSec: mapValueOfType<int>(json, r'duration_sec'),
        rest: mapValueOfType<int>(json, r'rest') ?? 90,
      );
    }
    return null;
  }

  static List<Exercise> listFromJson(dynamic json, {bool growable = false,}) {
    final result = <Exercise>[];
    if (json is List && json.isNotEmpty) {
      for (final row in json) {
        final value = Exercise.fromJson(row);
        if (value != null) {
          result.add(value);
        }
      }
    }
    return result.toList(growable: growable);
  }

  static Map<String, Exercise> mapFromJson(dynamic json) {
    final map = <String, Exercise>{};
    if (json is Map && json.isNotEmpty) {
      json = json.cast<String, dynamic>(); // ignore: parameter_assignments
      for (final entry in json.entries) {
        final value = Exercise.fromJson(entry.value);
        if (value != null) {
          map[entry.key] = value;
        }
      }
    }
    return map;
  }

  // maps a json object with a list of Exercise-objects as value to a dart map
  static Map<String, List<Exercise>> mapListFromJson(dynamic json, {bool growable = false,}) {
    final map = <String, List<Exercise>>{};
    if (json is Map && json.isNotEmpty) {
      // ignore: parameter_assignments
      json = json.cast<String, dynamic>();
      for (final entry in json.entries) {
        map[entry.key] = Exercise.listFromJson(entry.value, growable: growable,);
      }
    }
    return map;
  }

  /// The list of required keys that must be present in a JSON.
  static const requiredKeys = <String>{
    'name',
  };
}

