import 'package:flutter/material.dart';
import 'package:frontend/model/exercise.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';
import 'package:frontend/screens/exercises/components/exerciseEdit.dart';

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
  bool _isExpanded = true;

  @override
  void initState() {
    super.initState();
    // Collapse if exercise is already completed
    _isExpanded = !widget.exercise.isCompleted;
  }

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
                    onTap: () => showExerciseEditDialog(
                      context,
                      themeState,
                      widget.exercise,
                      initialName: widget.exercise.name,
                    ),
                    child: Row(
                      children: [
                        // Exercise completion checkbox
                        Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            color: themeState.themeData.colorScheme.secondary
                                .withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(30),
                          ),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              borderRadius: BorderRadius.circular(30),
                              onTap: () {
                                setState(() {
                                  widget.exercise.isCompleted = !widget.exercise.isCompleted;
                                  // Collapse when completed, expand when uncompleted
                                  _isExpanded = !widget.exercise.isCompleted;
                                });
                                // Notify parent if callback is provided
                                widget.onExerciseUpdated?.call(widget.exercise);
                              },
                              child: Center(
                                child: Container(
                                  width: 24,
                                  height: 24,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: widget.exercise.isCompleted
                                          ? themeState.themeData.colorScheme.secondary
                                          : themeState.themeData.colorScheme.secondary.withValues(alpha: 0.5),
                                      width: 2,
                                    ),
                                    color: widget.exercise.isCompleted
                                        ? themeState.themeData.colorScheme.secondary
                                        : Colors.transparent,
                                  ),
                                  child: widget.exercise.isCompleted
                                      ? Icon(
                                          Icons.check,
                                          color: themeState.themeData.colorScheme.onSecondary,
                                          size: 16,
                                        )
                                      : null,
                                ),
                              ),
                            ),
                          ),
                        ),

                        SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${widget.exercise.name}',
                                style: themeState.themeData.textTheme.bodyLarge,
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
                
                // Reorder handle
                ReorderableDragStartListener(
                  index: widget.index ?? 0,
                  child: Icon(
                    Icons.drag_handle,
                    color: themeState.themeData.colorScheme.secondary.withValues(alpha: 0.6),
                  ),
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
                  SizedBox(height: 20),
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
    // Build details dynamically from all non-null fields of the set
    List<String> setDetails = [];
    final Map<String, dynamic> setMap = set.toJson();
    setMap.forEach((key, value) {
      if(key == 'rest'){
        return;
      }
      if (value != null) {
        final prettyKey = key.replaceAll('_', ' ').replaceFirstMapped(
          RegExp(r'^[a-z]'),
          (m) => m.group(0)!.toUpperCase(),
        );
        setDetails.add('$prettyKey: $value');
      }
    });

    return Column(
      children: [
        if (setNumber > 1)
          Divider(
            color: themeState.themeData.dividerColor.withValues(alpha: 0.2),
            height: 16,
            thickness: 0.5,
          ),
        Padding(
          padding: EdgeInsets.symmetric(vertical: 8),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(width: 12),
              Expanded(
                child: setDetails.isNotEmpty
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: setDetails.map((detail) => Padding(
                          padding: EdgeInsets.symmetric(vertical: 2),
                          child: Text(
                            detail,
                            style: themeState.themeData.textTheme.bodySmall,
                          ),
                        )).toList(),
                      )
                    : Text(
                        'No details',
                        style: themeState.themeData.textTheme.bodySmall,
                      ),
              ),
            ],
          ),
        ),
      ],
    );
  }

}
