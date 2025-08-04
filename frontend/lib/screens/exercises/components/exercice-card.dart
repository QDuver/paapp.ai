import 'package:flutter/material.dart';
import 'package:frontend/api.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class ExerciseCard extends StatelessWidget {
  final Exercise exercise;

  const ExerciseCard({Key? key, required this.exercise}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();

    return Card(
      margin: EdgeInsets.only(bottom: 16),
      color: themeState.themeData.cardColor,
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => _showEditExerciseDialog(context, themeState, exercise),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              // Exercise icon
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: themeState.themeData.colorScheme.secondary
                      .withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Icon(
                  Icons.fitness_center,
                  color: themeState.themeData.colorScheme.secondary,
                  size: 30,
                ),
              ),

              SizedBox(width: 16),

              // Exercise details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      exercise.name,
                      style: themeState.themeData.textTheme.bodySmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 4),
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      children: [
                        if (exercise.weightKg != null)
                          Text(
                            '${exercise.weightKg} kg',
                            style: themeState.themeData.textTheme.bodyMedium,
                          ),
                        if (exercise.repetitions != null)
                          Text(
                            '${exercise.repetitions} reps',
                            style: themeState.themeData.textTheme.bodyMedium,
                          ),
                        if (exercise.durationSec != null)
                          Text(
                            '${exercise.durationSec} sec',
                            style: themeState.themeData.textTheme.bodyMedium,
                          ),
                      ],
                    ),
                  ],
                ),
              ),

              // Rest badge
              Container(
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                  border:
                      Border.all(color: Colors.green.withValues(alpha: 0.3)),
                ),
                child: Text(
                  'Rest: ${exercise.rest} sec',
                  style: TextStyle(
                    color: Colors.green,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showEditExerciseDialog(
      BuildContext context, ThemeState themeState, Exercise exercise) {
    final weightController =
        TextEditingController(text: exercise.weightKg?.toString() ?? '');
    final repsController =
        TextEditingController(text: exercise.repetitions?.toString() ?? '');
    final durationController =
        TextEditingController(text: exercise.durationSec?.toString() ?? '');

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          backgroundColor: themeState.themeData.cardColor,
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(height: 24),
                // Weight input - only show if exercise has weight
                if (exercise.weightKg != null) ...[
                  TextField(
                    controller: weightController,
                    keyboardType:
                        TextInputType.numberWithOptions(decimal: true),
                    style: themeState.themeData.textTheme.bodyMedium,
                    decoration: InputDecoration(
                      labelText: 'Weight (kg)',
                      labelStyle: themeState.themeData.textTheme.bodyMedium,
                      border: OutlineInputBorder(),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: themeState.themeData.colorScheme.secondary
                              .withValues(alpha: 0.3),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: themeState.themeData.colorScheme.secondary,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                ],

                // Repetitions input - only show if exercise has repetitions
                if (exercise.repetitions != null) ...[
                  TextField(
                    controller: repsController,
                    keyboardType: TextInputType.number,
                    style: themeState.themeData.textTheme.bodyMedium,
                    decoration: InputDecoration(
                      labelText: 'Repetitions',
                      labelStyle: themeState.themeData.textTheme.bodyMedium,
                      border: OutlineInputBorder(),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: themeState.themeData.colorScheme.secondary
                              .withValues(alpha: 0.3),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: themeState.themeData.colorScheme.secondary,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                ],

                // Duration input - only show if exercise has duration
                if (exercise.durationSec != null) ...[
                  TextField(
                    controller: durationController,
                    keyboardType: TextInputType.number,
                    style: themeState.themeData.textTheme.bodyMedium,
                    decoration: InputDecoration(
                      labelText: 'Duration (seconds)',
                      labelStyle: themeState.themeData.textTheme.bodyMedium,
                      border: OutlineInputBorder(),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: themeState.themeData.colorScheme.secondary
                              .withValues(alpha: 0.3),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: themeState.themeData.colorScheme.secondary,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: Text(
                'Cancel',
                style: TextStyle(
                    color: themeState.themeData.textTheme.bodyMedium?.color),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                () {
                  print('Saving exercise changes');
                };
                Navigator.of(dialogContext).pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: themeState.themeData.colorScheme.secondary,
              ),
              child: Text(
                'Save',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        );
      },
    );
  }
}
