import 'package:flutter/material.dart';
import 'package:frontend/components/card/card.dart';
import 'package:frontend/components/card/abstracts.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class CardList extends StatefulWidget {
  final MetaAbstract obj;

  const CardList({Key? key, required this.obj})
    : super(key: key);

  @override
  State<CardList> createState() => _CardListState();
}

class _CardListState extends State<CardList> {
  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);

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
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.inbox_outlined,
                        size: 64,
                        color: themeState.themeData.colorScheme.secondary,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Nothing for this date',
                        style: themeState.themeData.textTheme.bodyMedium
                            ?.copyWith(
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
                child: Icon(Icons.add, color: themeState.themeData.cardColor),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _addNewItem() {
    print('_addNewItem');
  }

  void _generateWithAI() async {
    print('_generateWithAI called');
    // final appState = Provider.of<AppState>(context, listen: false);
    // String itemType = T.toString();
    // await appState.generateWithAI(itemType);
  }
}
