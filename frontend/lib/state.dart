import 'package:flutter/material.dart';
import 'package:frontend/model/list.abstract.dart';
import 'package:frontend/model/list.exercise.dart';
import 'package:frontend/model/list.meal.dart';
import 'package:frontend/model/list.routine.dart';
import 'package:intl/intl.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'api.dart';

class AppState extends ChangeNotifier implements AppStateInterface {
  bool _isLoading = false;
  // bool isAuthChecking = !kDebugMode; // Skip auth checking in debug mode
  bool isAuthChecking = false;
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
  bool get isLoggedIn => true; // Always logged in (skip authentication)

  void setCurrentUser(User? user) {
    currentUser = user;
    isAuthChecking = false; // Auth check is complete
    notifyListeners();
  }

  int selectedNavigation = 0;
  List<ListAbstract> navigation = [
    Routines(), Exercises(), Meals()
  ];
  String get currentDate => DateFormat('yyyy-MM-dd').format(DateTime.now());

  Routines routines = Routines();
  Exercises exercises = Exercises();
  Meals meals = Meals();

  AppState() {
    ApiService.loadAll(this, setState);
  }

  void setState(void Function() updater) {
    updater();
    notifyListeners();
  }
}
