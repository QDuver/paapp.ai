import 'package:flutter/material.dart';
import 'package:frontend/components/card/simple_card.dart';
import 'package:frontend/components/card/simple_dialog.dart';
import 'package:frontend/components/card/reflection_helper.dart';
import 'package:frontend/model/exercise.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';
import 'components/empty.dart';

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

    return Stack(
      children: [
        Column(
          children: [
            if (exerciseDay != null && exerciseDay.exercises.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  physics: BouncingScrollPhysics(),
                  padding: EdgeInsets.symmetric(horizontal: 0, vertical: 8),
                  itemCount: exerciseDay.exercises.length,
                  itemBuilder: (context, index) {
                    final exercise = exerciseDay.exercises[index];
                    return SimpleCard(
                      item: exercise,
                      onSave: (updatedItem) async {
                        // Update the exercise in the list
                        appState.setState(() {
                          exerciseDay.exercises[index] = updatedItem as Exercise;
                        });
                        
                        // Persist changes to database
                        await exerciseDay.updateDb();
                      },
                      onDelete: () async {
                        // Remove the exercise from the list
                        appState.setState(() {
                          exerciseDay.exercises.removeAt(index);
                          // Re-index remaining exercises
                          for (int i = 0; i < exerciseDay.exercises.length; i++) {
                            exerciseDay.exercises[i].index = i;
                          }
                        });
                        
                        // Persist changes to database
                        await exerciseDay.updateDb();
                      },
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
            onPressed: () async {
              if (exerciseDay == null) return;

              // Create fields for a new exercise
              final fields = [
                FieldInfo(
                  name: 'name',
                  label: 'Exercise Name',
                  value: '',
                  required: true,
                  type: String,
                  hint: 'Enter exercise name',
                ),
              ];

              // Show dialog to get exercise name
              final result = await CustomEditDialog.show(
                context,
                fields: fields,
              );

              if (result != null && result['name']?.toString().trim().isNotEmpty == true) {
                // Create new exercise with the next index
                final newExercise = Exercise(
                  index: exerciseDay.exercises.length,
                  name: result['name'].toString().trim(),
                  sets: [],
                  isCompleted: false,
                );

                // Add to the list and update state
                appState.setState(() {
                  exerciseDay.exercises.add(newExercise);
                });

                // Persist changes to database
                await exerciseDay.updateDb();
              }
            },
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
