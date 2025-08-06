import 'package:flutter/material.dart';
import 'package:frontend/model/exercise.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class ExerciseDialogBox extends StatefulWidget {
  final Exercise exercise;
  final Function(Exercise)? onExerciseUpdated;
  final Function()? onExerciseDeleted;

  const ExerciseDialogBox({
    Key? key,
    required this.exercise,
    this.onExerciseUpdated,
    this.onExerciseDeleted,
  }) : super(key: key);

  @override
  State<ExerciseDialogBox> createState() => _ExerciseDialogBoxState();
}

class _ExerciseDialogBoxState extends State<ExerciseDialogBox> {
  late TextEditingController _exerciseNameController;
  late Exercise _editableExercise;
  List<TextEditingController> _weightControllers = [];
  List<TextEditingController> _repsControllers = [];
  List<TextEditingController> _durationControllers = [];
  List<TextEditingController> _restControllers = [];

  @override
  void initState() {
    super.initState();
    _exerciseNameController = TextEditingController(text: widget.exercise.name);
    
    // Create a copy of the exercise to edit
    _editableExercise = Exercise(
      index: widget.exercise.index,
      name: widget.exercise.name,
      sets: widget.exercise.sets?.map((set) => ExerciseSet(
        weightKg: set.weightKg,
        repetitions: set.repetitions,
        durationSec: set.durationSec,
        rest: set.rest,
      )).toList(),
    );

    _initializeControllers();
  }

  void _initializeControllers() {
    _weightControllers.clear();
    _repsControllers.clear();
    _durationControllers.clear();
    _restControllers.clear();

    if (_editableExercise.sets != null) {
      for (var set in _editableExercise.sets!) {
        _weightControllers.add(TextEditingController(
          text: set.weightKg?.toString() ?? '',
        ));
        _repsControllers.add(TextEditingController(
          text: set.repetitions?.toString() ?? '',
        ));
        _durationControllers.add(TextEditingController(
          text: set.durationSec?.toString() ?? '',
        ));
        _restControllers.add(TextEditingController(
          text: set.rest?.toString() ?? '90',
        ));
      }
    }
  }

  @override
  void dispose() {
    _exerciseNameController.dispose();
    for (var controller in _weightControllers) {
      controller.dispose();
    }
    for (var controller in _repsControllers) {
      controller.dispose();
    }
    for (var controller in _durationControllers) {
      controller.dispose();
    }
    for (var controller in _restControllers) {
      controller.dispose();
    }
    super.dispose();
  }

  void _updateExerciseFromControllers() {
    _editableExercise.name = _exerciseNameController.text;
    
    if (_editableExercise.sets != null) {
      for (int i = 0; i < _editableExercise.sets!.length; i++) {
        _editableExercise.sets![i].weightKg = 
            double.tryParse(_weightControllers[i].text);
        _editableExercise.sets![i].repetitions = 
            int.tryParse(_repsControllers[i].text);
        _editableExercise.sets![i].durationSec = 
            int.tryParse(_durationControllers[i].text);
        _editableExercise.sets![i].rest = 
            int.tryParse(_restControllers[i].text) ?? 90;
      }
    }
  }

  void _deleteSet(int index) {
    setState(() {
      _editableExercise.sets?.removeAt(index);
      _weightControllers[index].dispose();
      _repsControllers[index].dispose();
      _durationControllers[index].dispose();
      _restControllers[index].dispose();
      
      _weightControllers.removeAt(index);
      _repsControllers.removeAt(index);
      _durationControllers.removeAt(index);
      _restControllers.removeAt(index);
    });
  }

  void _addNewSet() {
    setState(() {
      _editableExercise.sets ??= [];
      _editableExercise.sets!.add(ExerciseSet(rest: 90));
      
      _weightControllers.add(TextEditingController());
      _repsControllers.add(TextEditingController());
      _durationControllers.add(TextEditingController());
      _restControllers.add(TextEditingController(text: '90'));
    });
  }

  void _saveChanges() {
    _updateExerciseFromControllers();
    widget.onExerciseUpdated?.call(_editableExercise);
    Navigator.of(context).pop();
  }

  void _deleteExercise() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Delete Exercise'),
          content: Text('Are you sure you want to delete this exercise?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop();
                widget.onExerciseDeleted?.call();
              },
              child: Text('Delete', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();

    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(context).size.height * 0.8,
          maxWidth: MediaQuery.of(context).size.width * 0.9,
        ),
        child: Container(
          padding: EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with title and delete button
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Edit Exercise',
                      style: themeState.themeData.textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: _deleteExercise,
                    icon: Icon(
                      Icons.delete,
                      color: Colors.red,
                    ),
                    tooltip: 'Delete Exercise',
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: Icon(Icons.close),
                  ),
                ],
              ),
              
              SizedBox(height: 16),
              
              // Exercise name field
              TextField(
                controller: _exerciseNameController,
                decoration: InputDecoration(
                  labelText: 'Exercise Name',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
              
              SizedBox(height: 20),
              
              // Sets section
              Row(
                children: [
                  Text(
                    'Sets',
                    style: themeState.themeData.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Spacer(),
                  TextButton.icon(
                    onPressed: _addNewSet,
                    icon: Icon(Icons.add),
                    label: Text('Add Set'),
                  ),
                ],
              ),
              
              SizedBox(height: 12),
              
              // Sets list
              Flexible(
                child: _editableExercise.sets == null || _editableExercise.sets!.isEmpty
                    ? Center(
                        child: Text(
                          'No sets added yet',
                          style: themeState.themeData.textTheme.bodyMedium?.copyWith(
                            color: themeState.themeData.textTheme.bodyMedium?.color?.withValues(alpha: 0.6),
                          ),
                        ),
                      )
                    : ListView.builder(
                        shrinkWrap: true,
                        itemCount: _editableExercise.sets!.length,
                        itemBuilder: (context, index) {
                          return _buildSetEditor(context, themeState, index);
                        },
                      ),
              ),
              
              SizedBox(height: 20),
              
              // Action buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: Text('Cancel'),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _saveChanges,
                      child: Text('Save Changes'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSetEditor(BuildContext context, ThemeState themeState, int index) {
    return Card(
      margin: EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Set header with number and delete button
            Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: themeState.themeData.colorScheme.secondary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Center(
                    child: Text(
                      '${index + 1}',
                      style: themeState.themeData.textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: themeState.themeData.colorScheme.secondary,
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Set ${index + 1}',
                    style: themeState.themeData.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: () => _deleteSet(index),
                  icon: Icon(Icons.delete_outline, color: Colors.red),
                  iconSize: 20,
                  tooltip: 'Delete Set',
                ),
              ],
            ),
            
            SizedBox(height: 12),
            
            // Set details input fields
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _weightControllers[index],
                    decoration: InputDecoration(
                      labelText: 'Weight (kg)',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      isDense: true,
                    ),
                    keyboardType: TextInputType.numberWithOptions(decimal: true),
                  ),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _repsControllers[index],
                    decoration: InputDecoration(
                      labelText: 'Reps',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      isDense: true,
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
              ],
            ),
            
            SizedBox(height: 8),
            
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _durationControllers[index],
                    decoration: InputDecoration(
                      labelText: 'Duration (sec)',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      isDense: true,
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _restControllers[index],
                    decoration: InputDecoration(
                      labelText: 'Rest (sec)',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      isDense: true,
                    ),
                    keyboardType: TextInputType.number,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
