import 'package:flutter/material.dart';
import 'package:frontend/components/card/abstracts.dart';
import 'package:frontend/components/card/dialog.dart' as custom_dialog;
import 'package:frontend/components/card/subcard.dart';
import 'package:frontend/model/exercise.dart';
import 'package:frontend/state.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class CustomCard extends StatelessWidget {
  final MetaAbstract obj;
  final CardAbstract item;

  const CustomCard({required this.obj, required this.item});

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();
    final appState = context.read<AppState>();
    final isExercise = item is Exercise;
    final exercise = isExercise ? item as Exercise : null;
    final hasSets = exercise?.items?.isNotEmpty == true;

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

                      // Content
                      Expanded(
                        child: Text(
                          item.name,
                          style: themeState.themeData.textTheme.bodyLarge,
                        ),
                      ),

                      // Expand/collapse button for exercises
                      if (exercise != null)
                        GestureDetector(
                          onTap: () {
                            exercise.isExpanded = !exercise.isExpanded;
                            appState.setState(() {});
                          },
                          child: Container(
                            padding: const EdgeInsets.all(4),
                            child: Icon(
                              exercise.isExpanded 
                                  ? Icons.expand_less 
                                  : Icons.expand_more,
                              color: themeState.themeData.colorScheme.onSurface,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),

              if (exercise != null && exercise.isExpanded) ...[
                if (hasSets)
                  ...exercise.items!.map((set) => SubCard(
                    obj: obj,
                    parentItem: item,
                    subItem: set,
                    onDelete: () {
                      exercise.items!.remove(set);
                      appState.setState(() {});
                      exercise.update(appState, obj, {});
                    },
                  )).toList(),
                
                Container(
                  margin: const EdgeInsets.only(left: 32.0, right: 16.0, top: 4.0, bottom: 8.0),
                  child: InkWell(
                    onTap: () {
                      exercise.items ??= [];
                      exercise.items!.add(ExerciseSet());
                      appState.setState(() {});
                      exercise.update(appState, obj, {});
                    },
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12.0),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: themeState.themeData.colorScheme.outline.withOpacity(0.5),
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
                            'Add Set',
                            style: themeState.themeData.textTheme.bodyMedium?.copyWith(
                              color: themeState.themeData.colorScheme.secondary,
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
