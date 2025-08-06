import 'package:flutter/material.dart';
import 'package:frontend/model/exercise.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:frontend/screens/exercises/components/exerciseDialogBox.dart';
import 'package:provider/provider.dart';

class ExerciseCard extends StatefulWidget {
  final Exercise exercise;
  final int? index;
  final Function(Exercise)? onExerciseUpdated;
  final Function()? onExerciseDeleted;

  const ExerciseCard({
    Key? key, 
    required this.exercise, 
    required this.index,
    this.onExerciseUpdated,
    this.onExerciseDeleted,
  }) : super(key: key);

  @override
  State<ExerciseCard> createState() => _ExerciseCardState();
}

class _ExerciseCardState extends State<ExerciseCard> {
  bool _isExpanded = false;

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
      child: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                // Exercise icon - tappable area for dialog
                Expanded(
                  child: InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return ExerciseDialogBox(
                            exercise: widget.exercise,
                            onExerciseUpdated: widget.onExerciseUpdated,
                            onExerciseDeleted: widget.onExerciseDeleted,
                          );
                        },
                      );
                    },
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
                                '${widget.exercise.name} - ${widget.exercise.index}',
                                style: themeState.themeData.textTheme.bodyMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              if (widget.exercise.sets != null && widget.exercise.sets!.isNotEmpty)
                                Text(
                                  '${widget.exercise.sets!.length} sets',
                                  style: themeState.themeData.textTheme.bodySmall?.copyWith(
                                    color: themeState.themeData.textTheme.bodySmall?.color?.withValues(alpha: 0.7),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Expand/collapse icon - separate tappable area
                IconButton(
                  onPressed: () {
                    setState(() {
                      _isExpanded = !_isExpanded;
                    });
                  },
                  icon: Icon(
                    _isExpanded ? Icons.expand_less : Icons.expand_more,
                    color: themeState.themeData.colorScheme.secondary,
                  ),
                  tooltip: _isExpanded ? 'Collapse' : 'Expand',
                ),
              ],
            ),
          ),
          
          // Expandable sets section
          if (_isExpanded && widget.exercise.sets != null && widget.exercise.sets!.isNotEmpty)
            Container(
              width: double.infinity,
              padding: EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Divider(
                    color: themeState.themeData.dividerColor.withValues(alpha: 0.3),
                    height: 1,
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Sets',
                    style: themeState.themeData.textTheme.bodySmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: themeState.themeData.colorScheme.secondary,
                    ),
                  ),
                  SizedBox(height: 8),
                  ...widget.exercise.sets!.asMap().entries.map((entry) {
                    int setIndex = entry.key;
                    ExerciseSet set = entry.value;
                    return _buildSetRow(context, themeState, setIndex + 1, set);
                  }).toList(),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSetRow(BuildContext context, ThemeState themeState, int setNumber, ExerciseSet set) {
    List<String> setDetails = [];
    
    if (set.repetitions != null) {
      setDetails.add('${set.repetitions} reps');
    }
    
    if (set.weightKg != null) {
      setDetails.add('${set.weightKg} kg');
    }
    if (set.rest != null && set.rest! > 0) {
      setDetails.add('Rest: ${set.rest}s');
    }

    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: themeState.themeData.colorScheme.secondary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                '$setNumber',
                style: themeState.themeData.textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: themeState.themeData.colorScheme.secondary,
                ),
              ),
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            child: Text(
              setDetails.isNotEmpty ? setDetails.join(' • ') : 'No details',
              style: themeState.themeData.textTheme.bodySmall,
            ),
          ),
        ],
      ),
    );
  }

}
