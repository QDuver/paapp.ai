import 'package:flutter/material.dart';
import 'package:frontend/screens/exercises/components/exerciseCard.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:frontend/model/exercise.dart';
import 'package:provider/provider.dart';
import 'components/noExercises.dart';

class ExercicePage extends StatefulWidget {
  @override
  _ExercicePageState createState() => _ExercicePageState();
}

class _ExercicePageState extends State<ExercicePage> {
  void _showAddExerciseDialog() {
    // final themeState = Provider.of<ThemeState>(context, listen: false);
  }

  void _updateExercise(int index, Exercise updatedExercise) {
    final appState = context.read<AppState>();
    if (appState.exerciseDay != null) {
      appState.setState(() {
        appState.exerciseDay!.exercises[index] = updatedExercise;
      });
      // Note: In a real app, you would also update this on the server
    }
  }

  void _deleteExercise(int index) {
    final appState = context.read<AppState>();
    if (appState.exerciseDay != null) {
      appState.setState(() {
        appState.exerciseDay!.exercises.removeAt(index);
      });
      // Note: In a real app, you would also delete this on the server
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = context.watch<AppState>();
    final exerciseDay = appState.exerciseDay;

    return Scaffold(
      body: Container(
        color: themeState.themeData.primaryColor,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Card(
            elevation: 8,
            shadowColor: themeState.themeData.colorScheme.secondary
                .withValues(alpha: 0.3),
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
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          onPressed: () {
                            appState.setState(() {
                              appState.currentDate = appState.currentDate
                                  .subtract(Duration(days: 1));
                            });
                          },
                          icon: Icon(
                            Icons.chevron_left,
                            color: themeState.themeData.colorScheme.secondary,
                            size: 32,
                          ),
                        ),
                        Text(
                          appState.formattedCurrentDate,
                          style: themeState.themeData.textTheme.headlineSmall
                              ?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: themeState.themeData.colorScheme.secondary,
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            appState.setState(() {
                              appState.currentDate =
                                  appState.currentDate.add(Duration(days: 1));
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
                      padding:
                          EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      itemCount: exerciseDay.exercises.length,
                      itemBuilder: (context, index) {
                        final exercise = exerciseDay.exercises[index];
                        return ExerciseCard(
                          exercise: exercise, 
                          index: index,
                          onExerciseUpdated: (updatedExercise) => _updateExercise(index, updatedExercise),
                          onExerciseDeleted: () => _deleteExercise(index),
                        );
                      },
                    ))
                  else
                    NoExercisesWidget(),
                ],
              ),
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddExerciseDialog,
        backgroundColor: themeState.themeData.colorScheme.secondary,
        child: Icon(
          Icons.add,
          color: themeState.themeData.cardColor,
        ),
      ),
    );
  }
}
