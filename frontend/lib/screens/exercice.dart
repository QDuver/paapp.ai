import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/theme_state.dart';
import '../model/api.dart';

class ExercicePage extends StatefulWidget {
  final ExerciseDay? exerciseDay;

  const ExercicePage({
    super.key,
    this.exerciseDay,
  });

  @override
  _ExercicePageState createState() => _ExercicePageState();
}

class _ExercicePageState extends State<ExercicePage> {
  @override
  Widget build(BuildContext context) {
    final state = Provider.of<ThemeState>(context);
    return _buildExercisePage(state, widget.exerciseDay);
  }

  Widget _buildExercisePage(ThemeState state, ExerciseDay? exerciseDay) {
    return Container(
      color: state.themeData.primaryColor,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Card(
          elevation: 8,
          shadowColor:
              state.themeData.colorScheme.secondary.withValues(alpha: 0.3),
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
                  state.themeData.cardColor,
                  state.themeData.cardColor.withValues(alpha: 0.9),
                ],
              ),
            ),
            child: Column(
              children: [
                if (exerciseDay != null && exerciseDay.exercises.isNotEmpty)
                  Expanded(
                    child: ListView.builder(
                      physics: BouncingScrollPhysics(),
                      padding:
                          EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      itemCount: exerciseDay.exercises.length,
                      itemBuilder: (context, index) {
                        final exercise = exerciseDay.exercises[index];
                        return _buildExerciseCard(context, state, exercise);
                      },
                    ),
                  )
                else
                  Expanded(
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.fitness_center_outlined,
                            size: 80,
                            color: state.themeData.colorScheme.secondary
                                .withValues(alpha: 0.3),
                          ),
                          SizedBox(height: 16),
                          Text(
                            'No exercises for this date',
                            style:
                                state.themeData.textTheme.bodyLarge?.copyWith(
                              color: state.themeData.textTheme.bodyLarge?.color
                                  ?.withValues(alpha: 0.7),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildExerciseCard(
      BuildContext context, ThemeState state, Exercise exercise) {
    return Card(
      margin: EdgeInsets.only(bottom: 16),
      color: state.themeData.cardColor,
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () => _showEditExerciseDialog(context, state, exercise),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              // Exercise icon
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: state.themeData.colorScheme.secondary
                      .withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Icon(
                  Icons.fitness_center,
                  color: state.themeData.colorScheme.secondary,
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
                      style: state.themeData.textTheme.bodySmall?.copyWith(
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
                            style: state.themeData.textTheme.bodyMedium,
                          ),
                        if (exercise.repetitions != null)
                          Text(
                            '${exercise.repetitions} reps',
                            style: state.themeData.textTheme.bodyMedium,
                          ),
                        if (exercise.durationSec != null)
                          Text(
                            '${exercise.durationSec} sec',
                            style: state.themeData.textTheme.bodyMedium,
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
                  'Rest: ${exercise.rest ?? 0} sec',
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
      BuildContext context, ThemeState state, Exercise exercise) {
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
          backgroundColor: state.themeData.cardColor,
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
                    style: state.themeData.textTheme.bodyMedium,
                    decoration: InputDecoration(
                      labelText: 'Weight (kg)',
                      labelStyle: state.themeData.textTheme.bodyMedium,
                      border: OutlineInputBorder(),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: state.themeData.colorScheme.secondary
                              .withValues(alpha: 0.3),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: state.themeData.colorScheme.secondary,
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
                    style: state.themeData.textTheme.bodyMedium,
                    decoration: InputDecoration(
                      labelText: 'Repetitions',
                      labelStyle: state.themeData.textTheme.bodyMedium,
                      border: OutlineInputBorder(),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: state.themeData.colorScheme.secondary
                              .withValues(alpha: 0.3),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: state.themeData.colorScheme.secondary,
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
                    style: state.themeData.textTheme.bodyMedium,
                    decoration: InputDecoration(
                      labelText: 'Duration (seconds)',
                      labelStyle: state.themeData.textTheme.bodyMedium,
                      border: OutlineInputBorder(),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: state.themeData.colorScheme.secondary
                              .withValues(alpha: 0.3),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: state.themeData.colorScheme.secondary,
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
                    color: state.themeData.textTheme.bodyMedium?.color),
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
                backgroundColor: state.themeData.colorScheme.secondary,
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
