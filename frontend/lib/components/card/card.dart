import 'package:flutter/material.dart';
import 'package:frontend/model/abstracts.dart';
import 'package:frontend/components/card/dialog.dart' as custom_dialog;
import 'package:frontend/components/card/subcard.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class CustomCard extends StatelessWidget {
  final MetaAbstract obj;
  final CardAbstract item;

  const CustomCard({required this.obj, required this.item});

  List<dynamic>? _getItems(CardAbstract item) {
    try {
      return (item as dynamic).items;
    } catch (e) {
      return null;
    }
  }

  bool _isItemExpanded(CardAbstract item) {
    try {
      return (item as dynamic).isExpanded ?? false;
    } catch (e) {
      return false;
    }
  }

  List<Widget> _buildSubCards(CardAbstract item) {
    final itemsCollection = _getItems(item);
    if (itemsCollection != null && itemsCollection.isNotEmpty) {
      return itemsCollection
          .map(
            (subItem) => SubCard(obj: obj, parentItem: item, subItem: subItem),
          )
          .toList();
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();
    final appState = context.read<AppState>();

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 6.0),
      elevation: 4,
      color: themeState.themeData.cardColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Material(
          color: Colors.transparent,
          child: Column(
            children: [
              InkWell(
                onTap: () async {
                  await custom_dialog.CustomEditDialog.show(
                    context,
                    item: item,
                    parent: obj,
                    obj: obj,
                  );
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      // Completion toggle
                      GestureDetector(
                        onTap: () {
                          item.update(appState, obj, {
                            'isCompleted': !item.isCompleted,
                          });
                        },
                        child: Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: item.isCompleted
                                  ? themeState.themeData.colorScheme.secondary
                                  : themeState.themeData.colorScheme.outline,
                              width: 2,
                            ),
                            color: item.isCompleted
                                ? themeState.themeData.colorScheme.secondary
                                : Colors.transparent,
                          ),
                          child: item.isCompleted
                              ? Icon(
                                  Icons.check,
                                  size: 16,
                                  color: themeState.themeData.cardColor,
                                )
                              : null,
                        ),
                      ),

                      SizedBox(width: 16),
                      Expanded(
                        child: Text(
                          item.name,
                          style: themeState.themeData.textTheme.bodyLarge,
                        ),
                      ),
                      if (item.canAddItems)
                        GestureDetector(
                          onTap: () {
                            try {
                              final dynamic dynamicItem = item;
                              dynamicItem.isExpanded = !dynamicItem.isExpanded;
                              appState.setState(() {});
                            } catch (e) {
                              // Handle cases where item doesn't have isExpanded
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            child: Icon(
                              () {
                                try {
                                  return (item as dynamic).isExpanded
                                      ? Icons.expand_less
                                      : Icons.expand_more;
                                } catch (e) {
                                  return Icons.expand_more;
                                }
                              }(),
                              color: themeState.themeData.colorScheme.onSurface,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),

              if (item.canAddItems && _isItemExpanded(item)) ...[
                ..._buildSubCards(item),

                Container(
                  margin: const EdgeInsets.only(
                    left: 32.0,
                    right: 16.0,
                    top: 4.0,
                    bottom: 8.0,
                  ),
                  child: InkWell(
                    onTap: () async {
                      final dynamic dynamicItem = item;
                      dynamicItem.items ??= [];

                      final lastItem =
                          item.copyLastItem() ?? item.createNewItem();

                      if (lastItem != null) {
                        await custom_dialog.CustomEditDialog.show(
                          context,
                          item: lastItem,
                          parent: item,
                          obj: obj,
                          isCreate: true,
                        );
                      }
                    },
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12.0),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: themeState.themeData.colorScheme.outline
                              .withOpacity(0.5),
                          style: BorderStyle.solid,
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.add,
                            size: 18,
                            color: themeState.themeData.colorScheme.secondary,
                          ),
                          SizedBox(width: 8),
                          Text(
                            'Add Item',
                            style: themeState.themeData.textTheme.bodyMedium
                                ?.copyWith(
                                  color: themeState
                                      .themeData
                                      .colorScheme
                                      .secondary,
                                ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
