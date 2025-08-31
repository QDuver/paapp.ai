import 'package:flutter/material.dart';
import 'package:frontend/components/card/abstracts.dart';
import 'package:frontend/components/card/dialog.dart' as custom_dialog;
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class SubCard extends StatelessWidget {
  final MetaAbstract obj;
  final CardAbstract parentItem;
  final SubCardAbstract subItem;
  final VoidCallback? onDelete;

  const SubCard({
    required this.obj,
    required this.parentItem,
    required this.subItem,
    this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();

    return Container(
      margin: const EdgeInsets.only(left: 32.0, right: 16.0, top: 4.0, bottom: 4.0),
      child: Card(
        elevation: 2,
        color: themeState.themeData.cardColor.withOpacity(0.7),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () async {
                // Check if subItem is actually a CardAbstract (like ExerciseSet)
                if (subItem is CardAbstract) {
                  await custom_dialog.CustomEditDialog.show(
                    context,
                    item: subItem as CardAbstract,
                    obj: obj,
                  );
                }
              },
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12.0),
                child: Row(
                  children: [
                    // Sub-item indicator
                    Container(
                      width: 4,
                      height: 24,
                      decoration: BoxDecoration(
                        color: themeState.themeData.colorScheme.secondary.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),

                    SizedBox(width: 12),

                    // Content
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Main display text
                          Text(
                            _getDisplayText(),
                            style: themeState.themeData.textTheme.bodyMedium?.copyWith(
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          
                          // Subtitle if available
                          if (subItem.subtitle?.isNotEmpty == true) ...[
                            SizedBox(height: 4),
                            Text(
                              subItem.subtitle!,
                              style: themeState.themeData.textTheme.bodySmall?.copyWith(
                                color: themeState.themeData.colorScheme.onSurface.withOpacity(0.7),
                              ),
                            ),
                          ],

                          // Tags if available
                          if (subItem.tags?.isNotEmpty == true) ...[
                            SizedBox(height: 6),
                            Wrap(
                              spacing: 4,
                              children: subItem.tags!.map((tag) => Chip(
                                label: Text(
                                  tag,
                                  style: themeState.themeData.textTheme.bodySmall,
                                ),
                                backgroundColor: themeState.themeData.colorScheme.secondary.withOpacity(0.2),
                                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                visualDensity: VisualDensity.compact,
                              )).toList(),
                            ),
                          ],
                        ],
                      ),
                    ),

                    // Delete button
                    if (onDelete != null)
                      IconButton(
                        icon: Icon(
                          Icons.delete_outline,
                          size: 18,
                          color: themeState.themeData.colorScheme.error,
                        ),
                        onPressed: () {
                          _showDeleteDialog(context, themeState);
                        },
                        visualDensity: VisualDensity.compact,
                      ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  String _getDisplayText() {
    // Check if subItem has a getDisplayName method (like ExerciseSet)
    try {
      final result = (subItem as dynamic).getDisplayName?.call();
      if (result != null && result is String && result.isNotEmpty) {
        return result;
      }
    } catch (e) {
      // Fall back to description if getDisplayName fails or doesn't exist
    }
    
    // Fall back to description or a default text
    if (subItem.description?.isNotEmpty == true) {
      return subItem.description!;
    }
    
    return 'Sub-item';
  }

  void _showDeleteDialog(BuildContext context, ThemeState themeState) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: themeState.themeData.cardColor,
        title: Text(
          'Delete Item',
          style: themeState.themeData.textTheme.titleLarge,
        ),
        content: Text(
          'Are you sure you want to delete this item?',
          style: themeState.themeData.textTheme.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(
              'Cancel',
              style: TextStyle(color: themeState.themeData.colorScheme.onSurface),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              onDelete?.call();
            },
            child: Text(
              'Delete',
              style: TextStyle(color: themeState.themeData.colorScheme.error),
            ),
          ),
        ],
      ),
    );
  }
}
