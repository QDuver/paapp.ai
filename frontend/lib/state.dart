import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'model/api.dart';
import 'apiService.dart';

/// Global app state that manages all application variables
/// This class uses ChangeNotifier to automatically update the UI when values change
class AppState extends ChangeNotifier {
  // Public state variables
  bool isLoading = false;
  DateTime currentDate = DateTime.now();
  String get formattedCurrentDate =>
      DateFormat('yyyy-MM-dd').format(currentDate);

  List<ExerciseDay>? exercises;
  ExerciseDay? exerciseDay;
  int selectedNavigation = 1;
  List<Map<String, dynamic>> navigation = [
    {'name': 'Home', 'icon': Icons.home},
    {'name': 'Exercises', 'icon': Icons.fitness_center},
    {'name': 'Nutrition', 'icon': Icons.restaurant}
  ];

  AppState() {
    setState(() => isLoading = true);
    _loadExercises();
  }

  /// Load exercises from API on initialization
  Future<void> _loadExercises() async {
    final result = await ApiService.get('exercises');
    setState(() {
      exercises = ExerciseDay.listFromJson(result);
      isLoading = false;
      exerciseDay = exercises?.firstWhere(
            (exercise) => exercise.day == formattedCurrentDate,
        );
    });
  }

  void setState(void Function() updater) {
    updater();
    notifyListeners();
  }

  // Navigate date helper methods
  void navigateDate(int direction) {
    setState(() => currentDate = currentDate.add(Duration(days: direction)));
  }

  void goToToday() {
    setState(() => currentDate = DateTime.now());
  }
}
