import 'package:flutter/material.dart';
import 'package:frontend/model/exercise.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class ExerciseField {
  final String title;
  final String value;
  final TextInputType keyboardType;
  final Function(String) onChanged;

  ExerciseField({
    required this.title,
    required this.value,
    this.keyboardType = TextInputType.text,
    required this.onChanged,
  });
}

class ExerciseDialog extends StatelessWidget {
  final Exercise exercise;
  final List<ExerciseField> fields;

  const ExerciseDialog({
    Key? key,
    required this.exercise,
    required this.fields,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();

    // Create controllers for each field
    final controllers = <String, TextEditingController>{};
    for (final field in fields) {
      controllers[field.title] = TextEditingController(text: field.value);
    }

    return AlertDialog(
      backgroundColor: themeState.themeData.cardColor,
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(height: 24),
            // Dynamically generate fields
            ...fields
                .map((field) =>
                    _buildField(field, controllers[field.title]!, themeState))
                .toList(),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(
            'Cancel',
            style: TextStyle(
                color: themeState.themeData.textTheme.bodyMedium?.color),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            // Call onChanged for each field with the current value
            for (final field in fields) {
              final controller = controllers[field.title];
              if (controller != null) {
                field.onChanged(controller.text);
              }
            }
            Navigator.of(context).pop();
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
  }

  Widget _buildField(ExerciseField field, TextEditingController controller,
      ThemeState themeState) {
    return Column(
      children: [
        TextField(
          controller: controller,
          keyboardType: field.keyboardType,
          style: themeState.themeData.textTheme.bodyMedium,
          decoration: InputDecoration(
            labelText: field.title,
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
    );
  }
}
