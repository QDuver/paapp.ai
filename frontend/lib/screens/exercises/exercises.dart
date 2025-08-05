import 'package:flutter/material.dart';
import 'package:frontend/screens/exercises/components/exerciseCard.dart';
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
    final nameController = TextEditingController();
    final weightController = TextEditingController();
    final repsController = TextEditingController();
    final themeState = Provider.of<ThemeState>(context, listen: false);

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: themeState.themeData.cardColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: Text(
            'Add Exercise',
            style: TextStyle(
              color: themeState.themeData.colorScheme.secondary,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: 'Exercise Name',
                  labelStyle: TextStyle(
                    color: themeState.themeData.colorScheme.secondary,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: themeState.themeData.colorScheme.secondary
                          .withValues(alpha: 0.5),
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: themeState.themeData.colorScheme.secondary,
                    ),
                  ),
                ),
                style: TextStyle(
                  color: themeState.themeData.colorScheme.secondary,
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: weightController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Weight (kg)',
                  labelStyle: TextStyle(
                    color: themeState.themeData.colorScheme.secondary,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: themeState.themeData.colorScheme.secondary
                          .withValues(alpha: 0.5),
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: themeState.themeData.colorScheme.secondary,
                    ),
                  ),
                ),
                style: TextStyle(
                  color: themeState.themeData.colorScheme.secondary,
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: repsController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  labelText: 'Repetitions',
                  labelStyle: TextStyle(
                    color: themeState.themeData.colorScheme.secondary,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: themeState.themeData.colorScheme.secondary
                          .withValues(alpha: 0.5),
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: themeState.themeData.colorScheme.secondary,
                    ),
                  ),
                ),
                style: TextStyle(
                  color: themeState.themeData.colorScheme.secondary,
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text(
                'Cancel',
                style: TextStyle(
                  color: themeState.themeData.colorScheme.secondary
                      .withValues(alpha: 0.7),
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                // TODO: Add exercise logic here
                final name = nameController.text.trim();
                final weight = double.tryParse(weightController.text) ?? 0.0;
                final reps = int.tryParse(repsController.text) ?? 0;

                if (name.isNotEmpty && weight > 0 && reps > 0) {
                  // For now, just show a snackbar
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                          'Exercise "$name" would be added: ${weight}kg x $reps reps'),
                      backgroundColor:
                          themeState.themeData.colorScheme.secondary,
                    ),
                  );
                  Navigator.of(context).pop();
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content:
                          Text('Please fill in all fields with valid values'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: themeState.themeData.colorScheme.secondary,
                foregroundColor: themeState.themeData.cardColor,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text('Add Exercise'),
            ),
          ],
        );
      },
    );
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
