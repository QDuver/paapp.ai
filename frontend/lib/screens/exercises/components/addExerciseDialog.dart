import 'package:flutter/material.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class AddExerciseDialog extends StatefulWidget {
  final Function(String name, double weight, int reps) onAddExercise;

  const AddExerciseDialog({
    Key? key,
    required this.onAddExercise,
  }) : super(key: key);

  @override
  _AddExerciseDialogState createState() => _AddExerciseDialogState();
}

class _AddExerciseDialogState extends State<AddExerciseDialog> {
  final nameController = TextEditingController();
  final weightController = TextEditingController();
  final repsController = TextEditingController();

  @override
  void dispose() {
    nameController.dispose();
    weightController.dispose();
    repsController.dispose();
    super.dispose();
  }

  void _handleAddExercise(BuildContext context, ThemeState themeState) {
    final name = nameController.text.trim();
    final weight = double.tryParse(weightController.text) ?? 0.0;
    final reps = int.tryParse(repsController.text) ?? 0;

    if (name.isNotEmpty && weight > 0 && reps > 0) {
      widget.onAddExercise(name, weight, reps);
      Navigator.of(context).pop();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please fill in all fields with valid values'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String labelText,
    required ThemeState themeState,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      decoration: InputDecoration(
        labelText: labelText,
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
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context, listen: false);

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
          _buildTextField(
            controller: nameController,
            labelText: 'Exercise Name',
            themeState: themeState,
          ),
          SizedBox(height: 16),
          _buildTextField(
            controller: weightController,
            labelText: 'Weight (kg)',
            themeState: themeState,
            keyboardType: TextInputType.number,
          ),
          SizedBox(height: 16),
          _buildTextField(
            controller: repsController,
            labelText: 'Repetitions',
            themeState: themeState,
            keyboardType: TextInputType.number,
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
          onPressed: () => _handleAddExercise(context, themeState),
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
  }
}
