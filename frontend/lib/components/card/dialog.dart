import 'package:flutter/material.dart';
import 'package:frontend/model/abstracts.dart';
import 'package:frontend/components/dialogs/delete.dart';
import 'package:frontend/state.dart';
import 'package:provider/provider.dart';

class CustomEditDialog {
  static Future<Map<String, dynamic>?> show<T>(
    BuildContext context, {
    required EditableItem item,
    required T parent,
    required MetaAbstract obj,
    bool isCreate = false,
  }) async {
    final fields = item.getEditableFields();
    final controllers = <String, TextEditingController>{};
    final appState = context.read<AppState>();

    final fieldsToShow = fields;

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
          Row(
            children: [
              if (!isCreate)
                TextButton.icon(
                  onPressed: () async {
                    final confirmed = await DeleteConfirmationDialog.show(
                      context,
                    );

                    if (confirmed) {
                      item.delete(appState, obj, parent);
                      _disposeControllers(controllers);
                      Navigator.pop(context);
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
                  
                  if (isCreate) {
                    item.create(appState, obj, parent, result);
                  } else {
                    item.update(appState, obj, result);
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

  static void _disposeControllers(
    Map<String, TextEditingController> controllers,
  ) {
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
