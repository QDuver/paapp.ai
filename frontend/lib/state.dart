import 'package:flutter/material.dart';
import 'package:frontend/model/exerciseDay.dart';
import 'package:intl/intl.dart';
import 'apiService.dart';

class AppState extends ChangeNotifier {
  bool isLoading = false;
  DateTime currentDate = DateTime.now();
  String get formattedCurrentDate =>
      DateFormat('yyyy-MM-dd').format(currentDate);

  List<ExerciseDay>? exercises;

  ExerciseDay? get exerciseDay {
    if (exercises == null || exercises!.isEmpty) return null;

    final index = exercises!.indexWhere(
      (exercise) => exercise.day == formattedCurrentDate,
    );
    
    return index != -1 ? exercises![index] : null;
  }

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

  Future<void> _loadExercises() async {
    final result = await ApiService.request('exercises', 'GET');
    setState(() {
      exercises = ExerciseDay.fromJsonList(result);
      isLoading = false;
    });
  }

  void setState(void Function() updater) {
    updater();
    notifyListeners();
  }
}
