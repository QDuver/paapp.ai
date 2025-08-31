import 'package:flutter/material.dart';

class DeleteConfirmationDialog {
  static Future<bool> show(
    BuildContext context, {
    String title = 'Delete Item',
    String content = 'Are you sure you want to delete this item?',
  }) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(content),
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

    return confirmed ?? false;
  }
}
