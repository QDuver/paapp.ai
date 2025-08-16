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

  ExerciseSet({
    this.weightKg,
    this.repetitions,
    this.durationSec,
    this.rest = 90,
  });

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
    if (values.containsKey('weightKg')) {
      weightKg = _parseDouble(values['weightKg']);
    }
    if (values.containsKey('repetitions')) {
      repetitions = _parseInt(values['repetitions']);
    }
    if (values.containsKey('durationSec')) {
      durationSec = _parseInt(values['durationSec']);
    }
    if (values.containsKey('rest')) {
      rest = _parseInt(values['rest']) ?? 90;
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
  });

  @override
  String getDisplayName() => name;

  @override
  bool getCompletionStatus() => isCompleted;

  @override
  void setCompletionStatus(bool completed) {
    isCompleted = completed;
  }

  @override
  List<dynamic> getSubItems() => sets ?? [];

  @override
  bool canAddSubItems() => true; // Exercises can add new sets

  @override
  void addSubItem() {
    sets ??= [];
    sets!.add(ExerciseSet());
  }

  @override
  CardItem? createNewSubItem() => ExerciseSet(); // Create a new exercise set template

  @override
  void removeSubItem(int index) {
    if (sets != null && index >= 0 && index < sets!.length) {
      sets!.removeAt(index);
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
