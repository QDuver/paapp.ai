import 'package:flutter/material.dart';
import 'package:frontend/components/card/card.dart';
import 'package:frontend/components/card/dialog.dart' as custom_dialog;
import 'package:frontend/model/list.abstract.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class CardList extends StatefulWidget {
  final ListAbstract obj;

  const CardList({Key? key, required this.obj})
    : super(key: key);

  @override
  State<CardList> createState() => _CardListState();
}

class _CardListState extends State<CardList> {
  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();
    final appState = context.read<AppState>();

    return Stack(
      children: [
        Column(
          children: [
            if (widget.obj.items.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 0,
                    vertical: 8,
                  ),
                  itemCount: widget.obj.items.length,
                  itemBuilder: (context, index) {
                    final card = widget.obj.items[index];
                    return CustomCard(item: card, obj: widget.obj);
                  },
                ),
              )
            else
              Expanded( 
                child: Center(
                  child: ElevatedButton(
                    onPressed: () async {
                      await widget.obj.buildItems(appState, widget.obj.collection, appState.currentDate);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: themeState.themeData.colorScheme.tertiary,
                      foregroundColor: themeState.themeData.cardColor,
                      padding: const EdgeInsets.all(24),
                      shape: const CircleBorder(),
                      elevation: 8,
                      fixedSize: const Size(120, 120),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.auto_awesome,
                          size: 32,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Start day',
                          style: themeState.themeData.textTheme.labelMedium
                              ?.copyWith(
                                color: themeState.themeData.cardColor,
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
        if (widget.obj.items.isNotEmpty)
          Positioned(
            bottom: 16,
            right: 16,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                FloatingActionButton(
                  onPressed: () async {
                    await widget.obj.buildItems(appState, widget.obj.collection, appState.currentDate);
                  },
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
                  child: Icon(Icons.add, color: themeState.themeData.cardColor),
                ),
              ],
            ),
          ),
      ],
    );
  }

  void _addNewItem() async {
    final newItem = widget.obj.createNewItem();
    
    if (newItem != null) {
      await custom_dialog.CustomEditDialog.show(
        context,
        item: newItem,
        parent: widget.obj,
        obj: widget.obj,
        isCreate: true,
      );
    }
  }

}
