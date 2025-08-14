import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:frontend/model/exercise.dart';
import 'package:frontend/model/exercise_day.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

Future<void> showExerciseDialog(
  BuildContext context,
  ThemeState themeState, {
  Exercise? exercise, // null for add mode, provided for edit mode
  String? initialName,
}) async {
  final isEditMode = exercise != null;
  final controller = TextEditingController(text: initialName ?? '');
  final appState = context.read<AppState>();

  // Create working exercise
  Exercise workingExercise = isEditMode 
    ? Exercise(
        index: exercise.index,
        name: exercise.name,
        sets: exercise.sets?.map((set) => ExerciseSet(
          weightKg: set.weightKg,
          repetitions: set.repetitions,
          durationSec: set.durationSec,
          rest: set.rest,
        )).toList() ?? [],
      )
    : Exercise(
        index: appState.exerciseDay?.exercises.length ?? 0,
        name: '',
        sets: [ExerciseSet()],
      );

  try {
    await showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              backgroundColor: themeState.themeData.cardColor,
              titlePadding: EdgeInsets.only(left: 24, right: 8, top: 20, bottom: 0),
              contentPadding: EdgeInsets.fromLTRB(24, 12, 24, 0),
              actionsPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              insetPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              title: isEditMode 
                ? Row(
                    children: [
                      Expanded(
                        child: Text(
                          'Edit exercise',
                          style: themeState.themeData.textTheme.headlineSmall,
                        ),
                      ),
                      IconButton(
                        tooltip: 'Delete exercise',
                        icon: Icon(
                          Icons.delete_outline,
                          color: themeState.themeData.colorScheme.error,
                        ),
                        onPressed: () {
                          appState.setState(() {
                            appState.exerciseDay?.exercises.remove(exercise);
                            appState.exerciseDay?.updateDb();
                          });
                          Navigator.of(ctx).pop();
                        },
                      ),
                    ],
                  )
                : Text(
                    'Add exercise',
                    style: themeState.themeData.textTheme.headlineSmall,
                  ),
              content: SingleChildScrollView(
                child: Container(
                  width: double.maxFinite,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Exercise name field
                      TextField(
                        controller: controller,
                        autofocus: true,
                        textInputAction: TextInputAction.done,
                        style: themeState.themeData.textTheme.bodyLarge,
                        cursorColor: themeState.themeData.colorScheme.secondary,
                        decoration: InputDecoration(
                          labelText: 'Exercise name',
                          labelStyle: TextStyle(
                            color: themeState.themeData.colorScheme.secondary,
                          ),
                          hintText: 'Exercise name',
                          hintStyle: TextStyle(
                            color: themeState.themeData.colorScheme.secondary,
                          ),
                          floatingLabelStyle: TextStyle(
                            color: themeState.themeData.colorScheme.secondary,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(
                              color: themeState.themeData.colorScheme.outline,
                              width: 1,
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(
                              color: themeState.themeData.colorScheme.outline,
                              width: 1,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(
                              color: themeState.themeData.colorScheme.secondary,
                              width: 1.5,
                            ),
                          ),
                          contentPadding:
                              EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        ),
                      ),
                      SizedBox(height: 16),
                      
                      // Sets section
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Sets',
                            style: themeState.themeData.textTheme.titleMedium,
                          ),
                          IconButton(
                            tooltip: 'Add set',
                            icon: Icon(
                              Icons.add_circle_outline,
                              color: themeState.themeData.colorScheme.secondary,
                            ),
                            onPressed: () {
                              setState(() {
                                workingExercise.sets ??= [];
                                workingExercise.sets!.add(ExerciseSet());
                              });
                            },
                          ),
                        ],
                      ),
                      
                      // Sets list
                      ListView.builder(
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        itemCount: workingExercise.sets?.length ?? 0,
                        itemBuilder: (context, index) {
                          return _buildSetCard(
                            context,
                            themeState,
                            workingExercise.sets![index],
                            index + 1,
                            () => setState(() {
                              workingExercise.sets?.removeAt(index);
                            }),
                            () => setState(() {}),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: Text(isEditMode ? 'Close' : 'Cancel'),
                ),
                TextButton(
                  onPressed: () {
                    final exerciseName = controller.text.trim();
                    if (exerciseName.isNotEmpty) {
                      appState.setState(() {
                        if (isEditMode) {
                          // Update existing exercise
                          exercise.name = exerciseName;
                          exercise.sets = workingExercise.sets;
                          appState.exerciseDay?.updateDb();
                        } else {
                          // Add new exercise
                          workingExercise.name = exerciseName;
                          
                          if (appState.exerciseDay == null) {
                            final newExerciseDay = ExerciseDay(
                              day: appState.formattedCurrentDate,
                              exercises: [workingExercise],
                            );
                            appState.exerciseDays ??= [];
                            appState.exerciseDays!.add(newExerciseDay);
                            newExerciseDay.updateDb();
                          } else {
                            workingExercise.index = appState.exerciseDay!.exercises.length;
                            appState.exerciseDay!.exercises.add(workingExercise);
                            appState.exerciseDay!.updateDb();
                          }
                        }
                      });
                      Navigator.of(ctx).pop();
                    }
                  },
                  child: Text(isEditMode ? 'Save' : 'Add'),
                ),
              ],
            );
          },
        );
      },
    );
  } finally {
    // Ensure controller is always disposed, even if dialog is dismissed unexpectedly
    controller.dispose();
  }
}

// Convenience methods for backwards compatibility
Future<void> showExerciseAddDialog(
  BuildContext context,
  ThemeState themeState,
) async {
  await showExerciseDialog(context, themeState);
}

Future<void> showExerciseEditDialog(
  BuildContext context,
  ThemeState themeState,
  Exercise exercise, {
  required String initialName,
}) async {
  await showExerciseDialog(
    context, 
    themeState, 
    exercise: exercise, 
    initialName: initialName,
  );
}

Widget _buildSetCard(
  BuildContext context,
  ThemeState themeState,
  ExerciseSet set,
  int setNumber,
  VoidCallback onDelete,
  VoidCallback onUpdate,
) {
  return Card(
    margin: EdgeInsets.symmetric(vertical: 4),
    color: themeState.themeData.cardColor,
    elevation: 2,
    child: Padding(
      padding: EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Set $setNumber',
                style: themeState.themeData.textTheme.titleSmall,
              ),
              IconButton(
                tooltip: 'Delete set',
                icon: Icon(
                  Icons.delete_outline,
                  size: 20,
                  color: themeState.themeData.colorScheme.error,
                ),
                onPressed: onDelete,
              ),
            ],
          ),
          SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildNumberField(
                  themeState,
                  'Weight (kg)',
                  set.weightKg?.toString() ?? '',
                  (value) {
                    set.weightKg = double.tryParse(value);
                    onUpdate();
                  },
                  allowDecimals: true,
                ),
              ),
              SizedBox(width: 8),
              Expanded(
                child: _buildNumberField(
                  themeState,
                  'Reps',
                  set.repetitions?.toString() ?? '',
                  (value) {
                    set.repetitions = int.tryParse(value);
                    onUpdate();
                  },
                ),
              ),
              SizedBox(width: 8),
              Expanded(
                child: _buildNumberField(
                  themeState,
                  'Duration (sec)',
                  set.durationSec?.toString() ?? '',
                  (value) {
                    set.durationSec = int.tryParse(value);
                    onUpdate();
                  },
                ),
              ),
              SizedBox(width: 8),
              Expanded(
                child: _buildNumberField(
                  themeState,
                  'Rest (sec)',
                  set.rest?.toString() ?? '90',
                  (value) {
                    set.rest = int.tryParse(value) ?? 90;
                    onUpdate();
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

class _NumberField extends StatefulWidget {
  final ThemeState themeState;
  final String label;
  final String initialValue;
  final Function(String) onChanged;
  final bool allowDecimals;

  const _NumberField({
    Key? key,
    required this.themeState,
    required this.label,
    required this.initialValue,
    required this.onChanged,
    this.allowDecimals = false,
  }) : super(key: key);

  @override
  _NumberFieldState createState() => _NumberFieldState();
}

class _NumberFieldState extends State<_NumberField> {
  late TextEditingController _controller;
  bool _disposed = false;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialValue);
  }

  @override
  void didUpdateWidget(_NumberField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!_disposed && oldWidget.initialValue != widget.initialValue) {
      _controller.text = widget.initialValue;
    }
  }

  @override
  void dispose() {
    _disposed = true;
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_disposed) {
      return SizedBox.shrink(); // Return empty widget if disposed
    }
    
    return TextField(
      controller: _controller,
      keyboardType: widget.allowDecimals 
          ? TextInputType.numberWithOptions(decimal: true)
          : TextInputType.number,
      inputFormatters: widget.allowDecimals
          ? [FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*'))]
          : [FilteringTextInputFormatter.digitsOnly],
      style: widget.themeState.themeData.textTheme.bodyMedium,
      decoration: InputDecoration(
        labelText: widget.label,
        labelStyle: TextStyle(
          color: widget.themeState.themeData.colorScheme.secondary,
          fontSize: 12,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(6),
          borderSide: BorderSide(
            color: widget.themeState.themeData.colorScheme.outline,
            width: 1,
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(6),
          borderSide: BorderSide(
            color: widget.themeState.themeData.colorScheme.outline,
            width: 1,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(6),
          borderSide: BorderSide(
            color: widget.themeState.themeData.colorScheme.secondary,
            width: 1.5,
          ),
        ),
        contentPadding: EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        isDense: true,
      ),
      onChanged: _disposed ? null : widget.onChanged,
    );
  }
}

Widget _buildNumberField(
  ThemeState themeState,
  String label,
  String initialValue,
  Function(String) onChanged,
  {bool allowDecimals = false}
) {
  return _NumberField(
    key: ValueKey('${label}_${initialValue}'),
    themeState: themeState,
    label: label,
    initialValue: initialValue,
    onChanged: onChanged,
    allowDecimals: allowDecimals,
  );
}