import 'package:frontend/api.dart';
import 'package:frontend/components/card/reflection_helper.dart';

enum RoutineType { other, exercises, meal }

class Routine implements CardItem {
  String name;
  bool isCompleted;
  int? durationMin;
  RoutineType routineType;
  dynamic objects; // Can be List<dynamic>, Map<String, dynamic>, or empty array
  
  Routine({
    required this.name,
    this.isCompleted = false,
    this.durationMin = 0,
    this.routineType = RoutineType.other,
    this.objects,
  });

  factory Routine.fromJson(Map<String, dynamic> json) {
    return Routine(
      name: json['name'] as String,
      isCompleted: json['isCompleted'] as bool? ?? false,
      durationMin: json['durationMin'] as int?,
      routineType: _routineTypeFromString(json['routineType'] as String?),
      objects: json['objects'], // Keep as dynamic
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'isCompleted': isCompleted,
      if (durationMin != null) 'durationMin': durationMin,
      'routineType': _routineTypeToString(routineType),
      'objects': objects ?? [],
    };
  }

  // CardItem implementation
  @override
  String getDisplayName() => name;

  @override
  bool getCompletionStatus() => isCompleted;

  @override
  void setCompletionStatus(bool completed) {
    isCompleted = completed;
  }

  @override
  List<dynamic> getSubItems() => []; // Routines don't have sub-items for now

  @override
  List<FieldInfo> getEditableFields() {
    return [
      FieldInfo(
        name: 'name',
        label: 'Name',
        value: name,
        required: true,
        type: String,
      ),
      FieldInfo(
        name: 'durationMin',
        label: 'Duration (minutes)',
        value: durationMin?.toString() ?? '0',
        required: false,
        type: int,
      ),
      FieldInfo(
        name: 'routineType',
        label: 'Type',
        value: _routineTypeToString(routineType),
        required: true,
        type: String,
      ),
    ];
  }

  @override
  void updateFields(Map<String, dynamic> values) {
    if (values.containsKey('name')) {
      name = values['name'] as String;
    }
    if (values.containsKey('durationMin')) {
      final durationStr = values['durationMin'] as String?;
      durationMin = durationStr != null && durationStr.isNotEmpty 
          ? int.tryParse(durationStr) 
          : 0;
    }
    if (values.containsKey('routineType')) {
      routineType = _routineTypeFromString(values['routineType'] as String?);
    }
  }

  @override
  bool canAddSubItems() => false;

  @override
  void addSubItem() {
    // Not implemented for routines
  }

  @override
  CardItem? createNewSubItem() => null;

  @override
  void removeSubItem(int index) {
    // Not implemented for routines
  }

  static RoutineType _routineTypeFromString(String? value) {
    switch (value) {
      case 'exercises':
        return RoutineType.exercises;
      case 'meal':
        return RoutineType.meal;
      case 'other':
      default:
        return RoutineType.other;
    }
  }

  static String _routineTypeToString(RoutineType type) {
    switch (type) {
      case RoutineType.exercises:
        return 'exercises';
      case RoutineType.meal:
        return 'meal';
      case RoutineType.other:
        return 'other';
    }
  }

  static List<Routine> fromJsonList(dynamic result) {
    return (result as List<dynamic>)
        .map((item) => Routine.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<void> updateDb() async {
    await ApiService.request(
      'quentin-duverge/routines/$name',
      'POST',
      payload: this.toJson(),
    );
  }
}
