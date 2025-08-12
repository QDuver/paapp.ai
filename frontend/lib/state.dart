import 'package:flutter/material.dart';
import 'package:frontend/model/exerciseDay.dart';
import 'package:intl/intl.dart';
import 'apiService.dart';

class AppState extends ChangeNotifier implements AppStateInterface {
  bool _isLoading = false;
  BuildContext? _context;
  
  @override
  bool get isLoading => _isLoading;
  
  @override
  set isLoading(bool value) {
    _isLoading = value;
  }
  
  @override
  BuildContext? get context => _context;
  
  void setContext(BuildContext context) {
    _context = context;
  }
  
  int selectedNavigation = 0;
  DateTime currentDate = DateTime.now();
  String get formattedCurrentDate =>
      DateFormat('yyyy-MM-dd').format(currentDate);

  List<ExerciseDay>? exerciseDays;

  ExerciseDay? get exerciseDay {
    if (exerciseDays == null || exerciseDays!.isEmpty) return null;

    final index = exerciseDays!.indexWhere(
      (exercise) => exercise.day == formattedCurrentDate,
    );

    return index != -1 ? exerciseDays![index] : null;
  }

  List<Map<String, dynamic>> navigation = [
    {'name': 'Routine', 'icon': Icons.accessibility_new},
    {'name': 'Exercises', 'icon': Icons.fitness_center},
    {'name': 'Nutrition', 'icon': Icons.restaurant}
  ];

  AppState() {
    _loadExercises();
  }

  Future<void> _loadExercises() async {
    final result = await ApiService.request(
      'quentin-duverge/exercises', 
      'GET',
      appState: this,
    );
    setState(() {
      if (result != null) {
        exerciseDays = ExerciseDay.fromJsonList(result);
      }
    });
  }

  Future<void> startDay({String? notes}) async {
    final payload = {
      'notes': notes ?? '',
    };
    
    final result = await ApiService.request(
      'start-day',
      'POST',
      payload: payload,
      appState: this,
    );
    
    if (result != null) {
      // Reload exercises after starting the day
      await _loadExercises();
    }
  }

  Future<void> reorderExercise(int oldIndex, int newIndex) async {
    final currentExerciseDay = exerciseDay;
    if (currentExerciseDay == null || currentExerciseDay.exercises.isEmpty)
      return;

    setState(() {
      final exercise = currentExerciseDay.exercises.removeAt(oldIndex);
      currentExerciseDay.exercises.insert(newIndex, exercise);

      for (int i = 0; i < currentExerciseDay.exercises.length; i++) {
        currentExerciseDay.exercises[i].index = i;
      }
    });

    await currentExerciseDay.updateDb();
  }

  void setState(void Function() updater) {
    updater();
    notifyListeners();
  }
}
