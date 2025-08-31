import 'package:flutter/material.dart';
import 'package:frontend/model/card.abstract.dart';
import 'package:frontend/model/list.abstract.dart';
import 'package:frontend/model/subcard.abstract.dart';
import 'package:frontend/components/card/dialog.dart' as custom_dialog;
import 'package:frontend/components/dialogs/delete.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class SubCard extends StatelessWidget {
  final ListAbstract obj;
  final CardAbstract parentItem;
  final SubCardAbstract subItem;

  const SubCard({
    required this.obj,
    required this.parentItem,
    required this.subItem,
  });

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();
    final appState = context.read<AppState>();

    return Container(
      margin: const EdgeInsets.only(
        left: 32.0,
        right: 16.0,
        top: 4.0,
        bottom: 4.0,
      ),
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
                await custom_dialog.CustomEditDialog.show(
                  context,
                  item: subItem,
                  parent: parentItem,
                  obj: obj,
                );
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
                        color: themeState.themeData.colorScheme.secondary
                            .withOpacity(0.6),
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),

                    SizedBox(width: 12),

                    // Content
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            subItem.name,
                            style: themeState.themeData.textTheme.bodyMedium
                                ?.copyWith(fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Icon(
                        Icons.delete_outline,
                        size: 18,
                        color: themeState.themeData.colorScheme.error,
                      ),
                      onPressed: () async {
                        final confirmed = await DeleteConfirmationDialog.show(context);
                        if (confirmed) {
                          (parentItem as dynamic).items?.remove(subItem);
                          appState.setState(() {});
                          parentItem.update(appState, obj, {});
                        }
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
}
