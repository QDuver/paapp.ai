import 'package:flutter/material.dart';
import 'package:frontend/screens/exercises/components/exercice-card.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';
import 'components/no-exercises.dart';

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
                // Date navigation header
                if (exerciseDay != null)
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          onPressed: () {
                            appState.setState(() {
                              appState.currentDate = appState.currentDate.subtract(Duration(days: 1));
                            });
                          },
                          icon: Icon(
                            Icons.chevron_left,
                            color: themeState.themeData.colorScheme.secondary,
                            size: 32,
                          ),
                        ),
                        Text(
                          exerciseDay.day,
                          style: themeState.themeData.textTheme.headlineSmall
                              ?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: themeState.themeData.colorScheme.secondary,
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            appState.setState(() {
                              appState.currentDate = appState.currentDate.add(Duration(days: 1));
                            });
                          },
                          icon: Icon(
                            Icons.chevron_right,
                            color: themeState.themeData.colorScheme.secondary,
                            size: 32,
                          ),
                        ),
                      ],
                    ),
                  ),
                if (exerciseDay != null && exerciseDay.exercises.isNotEmpty)
                  Expanded(
                      child: ListView.builder(
                    physics: BouncingScrollPhysics(),
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: exerciseDay.exercises.length,
                    itemBuilder: (context, index) {
                      final exercise = exerciseDay.exercises[index];
                      return ExerciseCard(exercise: exercise);
                    },
                  ))
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
