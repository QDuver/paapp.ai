import 'package:flutter/material.dart';
import 'package:frontend/api.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';
import 'exercise-dialog.dart';

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
    // Create fields based on exercise properties
    final fields = <ExerciseField>[];

    // Add weight field if exercise has weight
    if (exercise.weightKg != null) {
      fields.add(ExerciseField(
        title: 'Weight (kg)',
        value: exercise.weightKg?.toString() ?? '',
        keyboardType: TextInputType.numberWithOptions(decimal: true),
        onChanged: (value) {
          final weight = double.tryParse(value);
          if (weight != null) {
            exercise.weightKg = weight;
          }
        },
      ));
    }

    // Add repetitions field if exercise has repetitions
    if (exercise.repetitions != null) {
      fields.add(ExerciseField(
        title: 'Repetitions',
        value: exercise.repetitions?.toString() ?? '',
        keyboardType: TextInputType.number,
        onChanged: (value) {
          final reps = int.tryParse(value);
          if (reps != null) {
            exercise.repetitions = reps;
          }
        },
      ));
    }

    // Add duration field if exercise has duration
    if (exercise.durationSec != null) {
      fields.add(ExerciseField(
        title: 'Duration (seconds)',
        value: exercise.durationSec?.toString() ?? '',
        keyboardType: TextInputType.number,
        onChanged: (value) {
          final duration = int.tryParse(value);
          if (duration != null) {
            exercise.durationSec = duration;
          }
        },
      ));
    }

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return ExerciseDialog(
          exercise: exercise,
          fields: fields,
        );
      },
    );
  }
}
