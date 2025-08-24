import 'package:frontend/components/card/annotations.dart';
import 'package:frontend/components/card/reflection_helper.dart';

class ExerciseSet implements CardItem {
  @Editable(label: "Weight (kg)")
  double? weightKg;
  
  @Editable(label: "Repetitions")
  int? repetitions;
  
  @Editable(label: "Duration (sec)")
  int? durationSec;
  
  @Editable(label: "Rest (sec)")
  int rest;

  // Reference to parent exercise and index for propagating changes
  Exercise? _parentExercise;
  int? _setIndex;

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

  // Method to set parent context
  void _setParentContext(Exercise parent, int index) {
    _parentExercise = parent;
    _setIndex = index;
  }

  @override
  String getDisplayName() {
    List<String> parts = [];
    if (weightKg != null) parts.add('${weightKg}kg');
    if (repetitions != null) parts.add('${repetitions} reps');
    if (durationSec != null) parts.add('${durationSec}s');
    return parts.isNotEmpty ? parts.join(' × ') : 'Set';
  }

  @override
  bool getCompletionStatus() => false; // Sets don't have completion status

  @override
  void setCompletionStatus(bool completed) {} // Sets don't have completion status

  @override
  List<dynamic> getSubItems() => []; // Sets don't have sub-items

  @override
  bool canAddSubItems() => false; // Sets can't add sub-items

  @override
  void addSubItem() {} // Sets can't add sub-items

  @override
  CardItem? createNewSubItem() => null; // Sets can't create sub-items

  @override
  void removeSubItem(int index) {} // Sets can't remove sub-items

  @override
  List<FieldInfo> getEditableFields() {
    return [
      FieldInfo(
        name: 'weightKg',
        label: 'Weight (kg)',
        value: weightKg,
        required: false,
        type: double,
      ),
      FieldInfo(
        name: 'repetitions',
        label: 'Repetitions',
        value: repetitions,
        required: false,
        type: int,
      ),
      FieldInfo(
        name: 'durationSec',
        label: 'Duration (sec)',
        value: durationSec,
        required: false,
        type: int,
      ),
      FieldInfo(
        name: 'rest',
        label: 'Rest (sec)',
        value: rest,
        required: false,
        type: int,
      ),
    ];
  }

  @override
  void updateFields(Map<String, dynamic> values) {
    // Store original values to track what changed
    Map<String, dynamic> changedFields = {};
    
    if (values.containsKey('weightKg')) {
      double? newValue = _parseDouble(values['weightKg']);
      if (newValue != weightKg) {
        weightKg = newValue;
        changedFields['weightKg'] = newValue;
      }
    }
    if (values.containsKey('repetitions')) {
      int? newValue = _parseInt(values['repetitions']);
      if (newValue != repetitions) {
        repetitions = newValue;
        changedFields['repetitions'] = newValue;
      }
    }
    if (values.containsKey('durationSec')) {
      int? newValue = _parseInt(values['durationSec']);
      if (newValue != durationSec) {
        durationSec = newValue;
        changedFields['durationSec'] = newValue;
      }
    }
    if (values.containsKey('rest')) {
      int newValue = _parseInt(values['rest']) ?? 90;
      if (newValue != rest) {
        rest = newValue;
        changedFields['rest'] = newValue;
      }
    }

    // Propagate changes to subsequent sets
    if (changedFields.isNotEmpty && _parentExercise != null && _setIndex != null) {
      _parentExercise!._propagateSetChanges(_setIndex!, changedFields);
    }
  }

  double? _parseDouble(dynamic value) {
    if (value == null || value == '') return null;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value);
    return null;
  }

  int? _parseInt(dynamic value) {
    if (value == null || value == '') return null;
    if (value is int) return value;
    if (value is double) return value.toInt();
    if (value is String) return int.tryParse(value);
    return null;
  }
}

class Exercise implements CardItem {
  int index;
  
  @DisplayName()
  @Editable(label: "Exercise Name", required: true)
  String name;
  
  @SubItems()
  List<ExerciseSet>? sets;
  
  @CompletionField()
  bool isCompleted;

  Exercise({
    required this.index,
    required this.name,
    this.sets,
    this.isCompleted = false,
  }) {
    // Initialize parent context for existing sets
    _updateSetIndexes();
  }

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

  @override
  String getDisplayName() => name;

  @override
  bool getCompletionStatus() => isCompleted;

  @override
  void setCompletionStatus(bool completed) {
    isCompleted = completed;
  }

  @override
  List<dynamic> getSubItems() {
    _updateSetIndexes(); // Ensure parent context is set
    return sets ?? [];
  }

  @override
  bool canAddSubItems() => true; // Exercises can add new sets

  @override
  void addSubItem() {
    sets ??= [];
    ExerciseSet newSet = ExerciseSet();
    sets!.add(newSet);
    _updateSetIndexes();
  }

  @override
  CardItem? createNewSubItem() => ExerciseSet(); // Create a new exercise set template

  @override
  void removeSubItem(int index) {
    if (sets != null && index >= 0 && index < sets!.length) {
      sets!.removeAt(index);
      _updateSetIndexes();
    }
  }

  // Update parent context for all sets
  void _updateSetIndexes() {
    if (sets != null) {
      for (int i = 0; i < sets!.length; i++) {
        sets![i]._setParentContext(this, i);
      }
    }
  }

  // Propagate changes to subsequent sets
  void _propagateSetChanges(int fromIndex, Map<String, dynamic> changedFields) {
    if (sets == null || fromIndex >= sets!.length - 1) return;
    
    // Apply changes to all subsequent sets
    for (int i = fromIndex + 1; i < sets!.length; i++) {
      ExerciseSet targetSet = sets![i];
      
      // Apply each changed field to the target set using its updateFields method
      targetSet.updateFields(changedFields);
    }
  }

  @override
  List<FieldInfo> getEditableFields() {
    return [
      FieldInfo(
        name: 'name',
        label: 'Exercise Name',
        value: name,
        required: true,
        type: String,
      ),
    ];
  }

  @override
  void updateFields(Map<String, dynamic> values) {
    if (values.containsKey('name')) {
      name = values['name']?.toString() ?? name;
    }
  }
}
