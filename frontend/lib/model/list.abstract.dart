import 'package:flutter/material.dart';
import 'package:frontend/api.dart';
import 'package:frontend/model/list.exercise.dart';
import 'package:frontend/model/list.meal.dart';
import 'package:frontend/model/list.routine.dart';
import 'package:frontend/model/card.abstract.dart';
import 'package:frontend/state.dart';
import 'package:json_annotation/json_annotation.dart';

abstract class ListAbstract<T extends CardAbstract> {
  @JsonKey(includeFromJson: false, includeToJson: false)
  String label = '';
  IconData icon = Icons.help;
  String collection = '';
  String id = '';
  @JsonKey(defaultValue: [])
  List<T> items = const [];
  ListAbstract();
  Map<String, dynamic> toJson();
  T? createNewItem();

  Future<void> buildItems(AppState appState, String collection, String day) async {
    appState.isLoading = true;

    final result = await ApiService.buildItems(appState, collection, day);
    if(result == null) {
      appState.isLoading = false;
      return;
    }

    appState.setState(() {
      switch (collection) {
        case 'routines':
          appState.routines = Routines.fromJson(result);
          buildItems(appState, 'exercises', day);
          buildItems(appState, 'meals', day);
          break;
        case 'exercises':
          appState.exercises = Exercises.fromJson(result);
          break;
        case 'meals':
          appState.meals = Meals.fromJson(result);
          break;
      }
    });
  }
}
