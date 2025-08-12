import 'package:flutter/material.dart';
import 'package:frontend/screens/exercises/components/exerciseCard.dart';
import 'package:frontend/screens/exercises/components/exerciseEdit.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';
import 'components/noExercises.dart';

class ExercicePage extends StatefulWidget {
  @override
  _ExercicePageState createState() => _ExercicePageState();
}

class _ExercicePageState extends State<ExercicePage> {
  void _showAddExerciseDialog() {
    final themeState = Provider.of<ThemeState>(context, listen: false);
    showExerciseAddDialog(context, themeState);
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = context.watch<AppState>();
    final exerciseDay = appState.exerciseDay;

    return Stack(
      children: [
        Column(
          children: [
            if (exerciseDay != null && exerciseDay.exercises.isNotEmpty)
              Expanded(
                child: ReorderableListView.builder(
                  physics: BouncingScrollPhysics(),
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: exerciseDay.exercises.length,
                  onReorder: (oldIndex, newIndex) {
                    if (newIndex > oldIndex) {
                      newIndex -= 1;
                    }
                    appState.reorderExercise(oldIndex, newIndex);
                  },
                  itemBuilder: (context, index) {
                    final exercise = exerciseDay.exercises[index];
                    return ExerciseCard(
                      key: ValueKey(exercise.name + index.toString()),
                      exercise: exercise,
                      index: index,
                    );
                  },
                ),
              )
            else
              NoExercisesWidget(),
          ],
        ),
        Positioned(
          bottom: 16,
          right: 16,
          child: FloatingActionButton(
            onPressed: _showAddExerciseDialog,
            backgroundColor: themeState.themeData.colorScheme.secondary,
            child: Icon(
              Icons.add,
              color: themeState.themeData.cardColor,
            ),
          ),
        ),
      ],
    );
  }
}
