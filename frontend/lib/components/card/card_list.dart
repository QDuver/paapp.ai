import 'package:flutter/material.dart';
import 'package:frontend/components/card/simple_card.dart';
import 'package:frontend/components/card/simple_dialog.dart';
import 'package:frontend/components/card/reflection_helper.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class CardList<T extends CardItem> extends StatefulWidget {
  final List<T> items;
  final Function(List<T>) onItemsChanged;
  final T Function() createNewItem;
  final String? title;

  const CardList({
    super.key,
    required this.items,
    required this.onItemsChanged,
    required this.createNewItem,
    this.title,
  });

  @override
  State<CardList<T>> createState() => _CardListState<T>();
}

class _CardListState<T extends CardItem> extends State<CardList<T>> {
  String get _itemTypeName {
    // Extract the class name from the type
    final typeName = T.toString();
    // Convert from PascalCase to words
    return typeName
        .replaceAllMapped(
            RegExp(r'([A-Z])'), (match) => ' ${match.group(1)!.toLowerCase()}')
        .trim();
  }

  String get _emptyTitle => 'No ${_itemTypeName}s for this date';

  IconData get _emptyIcon {
    final typeName = T.toString().toLowerCase();
    if (typeName.contains('exercise')) {
      return Icons.fitness_center_outlined;
    } else if (typeName.contains('meal') || typeName.contains('ingredient')) {
      return Icons.restaurant_outlined;
    } else if (typeName.contains('task') || typeName.contains('todo')) {
      return Icons.task_outlined;
    } else {
      return Icons.inbox_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);

    return Stack(
      children: [
        Column(
          children: [
            if (widget.title != null)
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  widget.title!,
                  style: themeState.themeData.textTheme.headlineMedium,
                ),
              ),
            if (widget.items.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 0, vertical: 8),
                  itemCount: widget.items.length,
                  itemBuilder: (context, index) {
                    final item = widget.items[index];
                    return SimpleCard(
                      item: item,
                      onSave: (updatedItem) {
                        _updateItem(index, updatedItem as T);
                      },
                      onDelete: () {
                        _deleteItem(index);
                      },
                    );
                  },
                ),
              )
            else
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        _emptyIcon,
                        size: 64,
                        color: themeState.themeData.colorScheme.secondary,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _emptyTitle,
                        style:
                            themeState.themeData.textTheme.bodyMedium?.copyWith(
                          color: themeState.themeData.colorScheme.secondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
        Positioned(
          bottom: 16,
          right: 16,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              FloatingActionButton(
                onPressed: _generateWithAI,
                backgroundColor: themeState.themeData.colorScheme.tertiary,
                heroTag: "generateAI",
                child: Icon(
                  Icons.auto_awesome,
                  color: themeState.themeData.cardColor,
                ),
              ),
              const SizedBox(height: 12),
              FloatingActionButton(
                onPressed: _addNewItem,
                backgroundColor: themeState.themeData.colorScheme.secondary,
                heroTag: "addNew",
                child: Icon(
                  Icons.add,
                  color: themeState.themeData.cardColor,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _updateItem(int index, T updatedItem) {
    setState(() {
      widget.items[index] = updatedItem;
    });
    widget.onItemsChanged(widget.items);
  }

  void _deleteItem(int index) {
    setState(() {
      widget.items.removeAt(index);
      // Re-index remaining items if they have an index property
      for (int i = 0; i < widget.items.length; i++) {
        final item = widget.items[i];
        // Use reflection or dynamic access to update index if it exists
        try {
          (item as dynamic).index = i;
        } catch (e) {
          // Item doesn't have an index property, which is fine
        }
      }
    });
    widget.onItemsChanged(widget.items);
  }

  void _addNewItem() async {
    // Create a new item template
    final newItem = widget.createNewItem();
    final fields = newItem.getEditableFields();

    // Show dialog to get item details
    final result = await CustomEditDialog.show(
      context,
      fields: fields,
      isCreating: true, // Show all fields when creating a new item
    );

    if (result != null) {
      // Update the new item with the dialog result
      newItem.updateFields(result);

      // Set index if the item has an index property
      try {
        (newItem as dynamic).index = widget.items.length;
      } catch (e) {
        // Item doesn't have an index property, which is fine
      }

      // Add to the list
      setState(() {
        widget.items.add(newItem);
      });

      widget.onItemsChanged(widget.items);
    }
  }

  void _generateWithAI() async {
    final appState = Provider.of<AppState>(context, listen: false);
    String itemType = T.toString();
    await appState.generateWithAI(itemType);
  }
}
