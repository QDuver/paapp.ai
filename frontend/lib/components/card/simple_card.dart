import 'package:flutter/material.dart';
import 'package:frontend/components/card/reflection_helper.dart';
import 'package:frontend/components/card/simple_dialog.dart' as custom_dialog;
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class SimpleCard extends StatefulWidget {
  final CardItem item;
  final Function(CardItem) onSave;
  final VoidCallback? onDelete;

  const SimpleCard({
    super.key,
    required this.item,
    required this.onSave,
    this.onDelete,
  });

  @override
  State<SimpleCard> createState() => _SimpleCardState();
}

class _SimpleCardState extends State<SimpleCard> {
  bool _isExpanded = true;

  @override
  void initState() {
    super.initState();
    // Collapse if item is already completed
    _isExpanded = !widget.item.getCompletionStatus();
  }

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();
    final subItems = widget.item.getSubItems();
    final hasSubItems = subItems.isNotEmpty;
    final canAddSubItems = widget.item.canAddSubItems();
    final showExpandButton = hasSubItems || canAddSubItems;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 6.0),
      elevation: 4,
      color: themeState.themeData.cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          // Main card header
          ClipRRect(
            borderRadius: BorderRadius.only(
              topLeft: Radius.circular(12),
              topRight: Radius.circular(12),
              bottomLeft: (!showExpandButton || !_isExpanded) ? Radius.circular(12) : Radius.zero,
              bottomRight: (!showExpandButton || !_isExpanded) ? Radius.circular(12) : Radius.zero,
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () async {
                  final fields = widget.item.getEditableFields();
                  final result = await custom_dialog.CustomEditDialog.show(
                    context, 
                    fields: fields,
                    onDelete: widget.onDelete,
                  );
                  
                  if (result != null) {
                    widget.item.updateFields(result);
                    widget.onSave(widget.item);
                    setState(() {});
                  }
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      // Completion toggle
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            final newStatus = !widget.item.getCompletionStatus();
                            widget.item.setCompletionStatus(newStatus);
                            _isExpanded = !newStatus; // Collapse when completed
                          });
                          widget.onSave(widget.item);
                        },
                        child: Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: widget.item.getCompletionStatus()
                                  ? themeState.themeData.colorScheme.secondary
                                  : themeState.themeData.colorScheme.outline,
                              width: 2,
                            ),
                            color: widget.item.getCompletionStatus()
                                ? themeState.themeData.colorScheme.secondary
                                : Colors.transparent,
                          ),
                          child: widget.item.getCompletionStatus()
                              ? Icon(
                                  Icons.check,
                                  size: 16,
                                  color: themeState.themeData.cardColor,
                                )
                              : null,
                        ),
                      ),

                      SizedBox(width: 16),

                      // Content
                      Expanded(
                        child: Text(
                          widget.item.getDisplayName(),
                          style: themeState.themeData.textTheme.bodyLarge,
                        ),
                      ),
                      
                      // Expand/collapse icon (only show if subItems exist or can be added)
                      if (showExpandButton)
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
              ),
            ),
          ),
          
          // Expandable sub-items section
          if (_isExpanded && (hasSubItems || canAddSubItems))
            Column(
              children: [
                Divider(
                  color: themeState.themeData.dividerColor.withValues(alpha: 0.3),
                  height: 1,
                ),
                ...subItems.asMap().entries.map((entry) {
                  int index = entry.key;
                  dynamic subItem = entry.value;
                  final isLast = index == subItems.length - 1 && !widget.item.canAddSubItems();
                  
                  return Column(
                    children: [
                      if (index > 0)
                        Divider(
                          color: themeState.themeData.dividerColor.withValues(alpha: 0.2),
                          height: 1,
                          thickness: 0.5,
                        ),
                      ClipRRect(
                        borderRadius: BorderRadius.only(
                          bottomLeft: isLast ? Radius.circular(12) : Radius.zero,
                          bottomRight: isLast ? Radius.circular(12) : Radius.zero,
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () async {
                              if (subItem is CardItem) {
                                final fields = subItem.getEditableFields();
                                final result = await custom_dialog.CustomEditDialog.show(
                                  context, 
                                  fields: fields,
                                  onDelete: () {
                                    setState(() {
                                      widget.item.removeSubItem(index);
                                    });
                                    widget.onSave(widget.item);
                                  },
                                );
                                
                                if (result != null) {
                                  subItem.updateFields(result);
                                  widget.onSave(widget.item);
                                  setState(() {});
                                }
                              }
                            },
                            child: Container(
                              width: double.infinity,
                              padding: EdgeInsets.fromLTRB(28, index == 0 ? 20 : 16, 16, isLast ? 16 : 16),
                              child: Text(
                                subItem is CardItem ? subItem.getDisplayName() : subItem.toString(),
                                style: themeState.themeData.textTheme.bodySmall,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  );
                }).toList(),
                
                // Add button for new sub-items
                if (widget.item.canAddSubItems())
                  Column(
                    children: [
                      if (subItems.isNotEmpty)
                        Divider(
                          color: themeState.themeData.dividerColor.withValues(alpha: 0.2),
                          height: 1,
                          thickness: 0.5,
                        ),
                      ClipRRect(
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(12),
                          bottomRight: Radius.circular(12),
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () async {
                              // Create a temporary new sub-item
                              final tempSubItem = widget.item.createNewSubItem();
                              if (tempSubItem != null) {
                                final fields = tempSubItem.getEditableFields();
                                final result = await custom_dialog.CustomEditDialog.show(
                                  context, 
                                  fields: fields,
                                  isCreating: true, // Show all fields when creating a new sub-item
                                );
                                
                                if (result != null) {
                                  // Only add the sub-item if user saved the dialog
                                  tempSubItem.updateFields(result);
                                  widget.item.addSubItem();
                                  // Update the newly added item with the dialog result
                                  final subItems = widget.item.getSubItems();
                                  if (subItems.isNotEmpty && subItems.last is CardItem) {
                                    (subItems.last as CardItem).updateFields(result);
                                  }
                                  widget.onSave(widget.item);
                                  setState(() {});
                                }
                              }
                            },
                            child: Container(
                              width: double.infinity,
                              padding: EdgeInsets.fromLTRB(28, subItems.isEmpty ? 20 : 16, 16, 16),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.add,
                                    size: 20,
                                    color: themeState.themeData.colorScheme.secondary,
                                  ),
                                  SizedBox(width: 8),
                                  Text(
                                    'Add Item',
                                    style: themeState.themeData.textTheme.bodySmall?.copyWith(
                                      color: themeState.themeData.colorScheme.secondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
              ],
            ),
        ],
      ),
    );
  }
}
