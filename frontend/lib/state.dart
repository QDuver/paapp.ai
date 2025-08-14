import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:frontend/model/exercise_day.dart';
import 'package:intl/intl.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'api.dart';

class AppState extends ChangeNotifier implements AppStateInterface {
  bool _isLoading = false;
  bool isAuthChecking = !kDebugMode; // Skip auth checking in debug mode
  BuildContext? context;
  User? currentUser;
  
  @override
  bool get isLoading => _isLoading;
  
  @override
  set isLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
  
  void setContext(BuildContext context) {
    this.context = context;
  }
  
  // User authentication state
  bool get isLoggedIn => kDebugMode || currentUser != null; // Always logged in during debug
  
  void setCurrentUser(User? user) {
    currentUser = user;
    isAuthChecking = false; // Auth check is complete
    print('Current user set: ${user?.displayName ?? 'No user'}, isAuthChecking: $isAuthChecking');
    
    // Load exercises after successful authentication or in debug mode
    if (user != null || kDebugMode) {
      loadExercises();
    }
    
    notifyListeners();
  }
  
  // User helper methods
  String? get userDisplayName => kDebugMode ? 'Debug User' : currentUser?.displayName;
  String? get userEmail => kDebugMode ? 'debug@example.com' : currentUser?.email;
  String? get userPhotoURL => currentUser?.photoURL;
  
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
    print('AppState constructor called, isAuthChecking: $isAuthChecking');
    // _loadExercises();
  }

  Future<void> loadExercises() async {
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
      await loadExercises();
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

  Future<void> updateExerciseCompletion() async {
    final currentExerciseDay = exerciseDay;
    if (currentExerciseDay != null) {
      await currentExerciseDay.updateDb();
    }
  }

  void setState(void Function() updater) {
    updater();
    notifyListeners();
  }
}
