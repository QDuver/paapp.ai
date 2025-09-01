import 'package:flutter/material.dart';
import 'package:frontend/model/list.abstract.dart';
import 'package:frontend/model/subcard.abstract.dart';
import 'package:frontend/components/dialogs/delete.dart';
import 'package:frontend/state.dart';
import 'package:provider/provider.dart';

class CustomEditDialog {
  static Future<Map<String, dynamic>?> show<T>(
    BuildContext context, {
    required EditableItemAbstract item,
    required T parent,
    required ListAbstract obj,
    bool isCreate = false,
  }) async {
    final fieldDescriptors = item.getEditableFields()
        .where((field) => field.name != 'isCompleted')
        .toList();
    final controllers = <String, TextEditingController>{};
    final appState = context.read<AppState>();

    for (final field in fieldDescriptors) {
      controllers[field.name] = TextEditingController(
        text: field.getter()?.toString() ?? '',
      );
    }

    return showDialog<Map<String, dynamic>>(
      context: context,
      builder: (context) => AlertDialog(
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: fieldDescriptors.map((field) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: TextField(
                  controller: controllers[field.name],
                  decoration: InputDecoration(
                    labelText: field.label,
                  ),
                  keyboardType: _getKeyboardTypeForField(field.type),
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
                  for (final field in fieldDescriptors) {
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

  static TextInputType _getKeyboardTypeForField(Type fieldType) {
    if (fieldType == int || fieldType == double) {
      return TextInputType.number;
    }
    return TextInputType.text;
  }
}
