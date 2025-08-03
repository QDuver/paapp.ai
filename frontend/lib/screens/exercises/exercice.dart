import 'package:flutter/material.dart';
import 'package:frontend/screens/exercises/components/exercice-card.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';
import '../../model/api.dart';
import 'no-exercises.dart';

class ExercicePage extends StatefulWidget {


  @override
  _ExercicePageState createState() => _ExercicePageState();
}

class _ExercicePageState extends State<ExercicePage> {
  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = context.watch<AppState>();
    final exerciseDay = appState.exerciseDay;


    return Container(
      color: themeState.themeData.primaryColor,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Card(
          elevation: 8,
          shadowColor:
              themeState.themeData.colorScheme.secondary.withValues(alpha: 0.3),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  themeState.themeData.cardColor,
                  themeState.themeData.cardColor.withValues(alpha: 0.9),
                ],
              ),
            ),
            child: Column(
              children: [
                if (exerciseDay != null && exerciseDay.exercises.isNotEmpty)
                  ExerciseCard()
                else
                  NoExercisesWidget(),
              ],
            ),
          ),
        ),
      ),
    );
  }


}

