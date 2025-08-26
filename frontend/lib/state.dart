import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:frontend/model/routine.dart';
import 'package:frontend/model/day.dart';
import 'package:frontend/model/exercise.dart';
import 'package:frontend/model/meal.dart';
import 'package:intl/intl.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'api.dart';

class AppState extends ChangeNotifier implements AppStateInterface {
  bool _isLoading = false;
  // bool isAuthChecking = !kDebugMode; // Skip auth checking in debug mode
  bool isAuthChecking = false; // Always skip auth checking
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
  bool get isLoggedIn => true; // Always logged in (skip authentication)
  
  void setCurrentUser(User? user) {
    currentUser = user;
    isAuthChecking = false; // Auth check is complete
    loadRoutines();
    notifyListeners();
  }
  
  int selectedNavigation = 1;
  DateTime currentDate = DateTime.now();
  String get formattedCurrentDate =>
      DateFormat('yyyy-MM-dd').format(currentDate);

  Day? dayData;

  Day? get day => dayData;

  // Helper getters for different routine types
  List<Routine> get allRoutines => day?.allRoutines ?? [];
  List<Routine> get exerciseRoutines => day?.exerciseRoutines ?? [];
  List<Routine> get mealRoutines => day?.mealRoutines ?? [];
  List<Routine> get otherRoutines => day?.otherRoutines ?? [];

  // Helper getters to extract individual exercises and meals from routines
  List<Exercise> get individualExercises {
    List<Exercise> exercises = [];
    int exerciseIndex = 0;
    
    for (Routine routine in exerciseRoutines) {
      if (routine.objects is List) {
        for (var exerciseData in routine.objects as List) {
          if (exerciseData is Map<String, dynamic>) {
            exercises.add(Exercise.fromJson(exerciseData, exerciseIndex));
            exerciseIndex++;
          }
        }
      }
    }
    return exercises;
  }

  List<Meal> get individualMeals {
    List<Meal> meals = [];
    
    for (Routine routine in mealRoutines) {
      if (routine.objects is Map<String, dynamic>) {
        meals.add(Meal.fromJson(routine.objects as Map<String, dynamic>));
      }
    }
    return meals;
  }

  // Methods to update individual exercises and meals back to their parent routines
  Future<void> updateIndividualExercises(List<Exercise> updatedExercises) async {
    // Update the exercises back into their parent routines
    for (Routine routine in exerciseRoutines) {
      if (routine.objects is List) {
        List<Map<String, dynamic>> exerciseObjects = [];
        for (Exercise exercise in updatedExercises) {
          exerciseObjects.add(exercise.toJson());
        }
        routine.objects = exerciseObjects;
        await routine.updateDb();
      }
    }
  }

  Future<void> updateIndividualMeals(List<Meal> updatedMeals) async {
    // Update the meals back into their parent routines
    int mealIndex = 0;
    for (Routine routine in mealRoutines) {
      if (routine.objects is Map<String, dynamic> && mealIndex < updatedMeals.length) {
        routine.objects = updatedMeals[mealIndex].toJson();
        await routine.updateDb();
        mealIndex++;
      }
    }
  }

  List<Map<String, dynamic>> navigation = [
    {'name': 'Routine', 'icon': Icons.accessibility_new},
    {'name': 'Exercises', 'icon': Icons.fitness_center},
    {'name': 'Nutrition', 'icon': Icons.restaurant}
  ];

  AppState() {
    loadRoutines();
  }

  Future<void> loadRoutines() async {
    final result = await ApiService.request(
      'quentin-duverge/routines/$formattedCurrentDate', 
      'GET',
      appState: this,
    );
    setState(() {
      if (result != null) {
        dayData = Day.fromJson(result);
      }
    });
  }

  // Method to update routines data (used after AI generation)
  void updateRoutines(List<Routine> newRoutines) {
    setState(() {
      if (dayData != null) {
        dayData!.routines = newRoutines;
      }
    });
  }

  // Generic method to clear items before AI generation
  Future<void> clearItemsBeforeGeneration(String itemType) async {
    switch (itemType.toLowerCase()) {
      case 'exercise':
        // Clear all exercises by setting empty objects in exercise routines
        for (Routine routine in exerciseRoutines) {
          routine.objects = [];
          await routine.updateDb();
        }
        break;
      case 'meal':
        // Clear all meals by setting empty objects in meal routines
        for (Routine routine in mealRoutines) {
          routine.objects = {};
          await routine.updateDb();
        }
        break;
      default:
        return; // Unknown item type, do nothing
    }
    
    // Notify listeners to update UI
    notifyListeners();
  }

  // Generic AI generation method
  Future<void> generateWithAI(String itemType) async {
    // First clear existing items
    await clearItemsBeforeGeneration(itemType);
    
    String endpoint;
    
    // Determine the API endpoint based on item type
    switch (itemType.toLowerCase()) {
      case 'exercise':
        endpoint = 'quentin-duverge/exercises/$formattedCurrentDate';
        break;
      case 'meal':
        endpoint = 'quentin-duverge/meals/$formattedCurrentDate';
        break;
      default:
        return; // Unknown item type, do nothing
    }
    
    final result = await ApiService.request(
      endpoint,
      'POST',
      payload: {}, // Empty payload for now, can be extended later
      appState: this,
    );
    
    if (result != null) {
      // The API returns the full routines of the day
      List<Routine> newRoutines;
      if (result is Map<String, dynamic> && result.containsKey('routines')) {
        newRoutines = Routine.fromJsonList(result['routines']);
      } else if (result is List) {
        newRoutines = Routine.fromJsonList(result);
      } else {
        return; // Invalid response format
      }
      
      // Update the routines
      updateRoutines(newRoutines);
    }
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
      // Reload days after starting the day
      await loadRoutines();
    }
  }

  Future<void> reorderRoutine(int oldIndex, int newIndex) async {
    final currentDay = day;
    if (currentDay == null || currentDay.routines.isEmpty)
      return;

    setState(() {
      final routine = currentDay.routines.removeAt(oldIndex);
      currentDay.routines.insert(newIndex, routine);
    });

    // Update each routine in the database
    for (var routine in currentDay.routines) {
      await routine.updateDb();
    }
  }


  void setState(void Function() updater) {
    updater();
    notifyListeners();
  }
}
