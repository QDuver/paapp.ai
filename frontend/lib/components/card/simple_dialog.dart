import 'package:flutter/material.dart';
import 'package:frontend/components/card/reflection_helper.dart';

class CustomEditDialog {
  static Future<Map<String, dynamic>?> show(
    BuildContext context, {
    required List<FieldInfo> fields,
    VoidCallback? onDelete,
    bool isCreating = false,
  }) async {
    final controllers = <String, TextEditingController>{};
    
    // Filter fields based on whether we're creating or editing
    final fieldsToShow = isCreating 
        ? fields // Show all fields when creating
        : fields.where((field) => 
            field.required || // Always show required fields
            (field.value != null && field.value.toString().trim().isNotEmpty) // Show non-null, non-empty fields
          ).toList();
    
    // Initialize controllers for each field
    for (final field in fieldsToShow) {
      controllers[field.name] = TextEditingController(
        text: field.value?.toString() ?? '',
      );
    }

    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (context) => AlertDialog(
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: fieldsToShow.map((field) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: TextField(
                  controller: controllers[field.name],
                  decoration: InputDecoration(
                    labelText: field.label,
                    hintText: field.hint,
                  ),
                  keyboardType: _getKeyboardType(field.type),
                ),
              );
            }).toList(),
          ),
        ),
        actions: [
          // Delete button (only show if onDelete callback is provided)
          if (onDelete != null)
            Row(
              children: [
                TextButton.icon(
                  onPressed: () async {
                    final confirmed = await showDialog<bool>(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text('Delete Item'),
                        content: Text('Are you sure you want to delete this item?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.of(context).pop(false),
                            child: Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.of(context).pop(true),
                            child: Text('Delete'),
                            style: TextButton.styleFrom(
                              foregroundColor: Theme.of(context).colorScheme.error,
                            ),
                          ),
                        ],
                      ),
                    );
                    
                    if (confirmed == true) {
                      _disposeControllers(controllers);
                      Navigator.pop(context);
                      onDelete();
                    }
                  },
                  icon: Icon(Icons.delete_outline),
                  label: Text('Delete'),
                  style: TextButton.styleFrom(
                    foregroundColor: Theme.of(context).colorScheme.error,
                  ),
                ),
                Spacer(),
                TextButton(
                  onPressed: () {
                    _disposeControllers(controllers);
                    Navigator.pop(context);
                  },
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    final result = <String, dynamic>{};
                    for (final field in fieldsToShow) {
                      final value = controllers[field.name]!.text;
                      result[field.name] = value;
                    }
                    
                    _disposeControllers(controllers);
                    Navigator.pop(context, result);
                  },
                  child: const Text('Save'),
                ),
              ],
            )
          else
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () {
                    _disposeControllers(controllers);
                    Navigator.pop(context);
                  },
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    final result = <String, dynamic>{};
                    for (final field in fieldsToShow) {
                      final value = controllers[field.name]!.text;
                      result[field.name] = value;
                    }
                    
                    _disposeControllers(controllers);
                    Navigator.pop(context, result);
                  },
                  child: const Text('Save'),
                ),
              ],
            ),
        ],
      ),
    );
  }

  static void _disposeControllers(Map<String, TextEditingController> controllers) {
    for (final controller in controllers.values) {
      controller.dispose();
    }
  }

  static TextInputType _getKeyboardType(Type type) {
    if (type == int || type == double) {
      return TextInputType.number;
    }
    return TextInputType.text;
  }
}
