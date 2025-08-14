import 'package:flutter/material.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:provider/provider.dart';

class NoExercisesWidget extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();
    return Expanded(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.fitness_center_outlined,
              size: 80,
              color: themeState.themeData.colorScheme.secondary
                  .withValues(alpha: 0.3),
            ),
            SizedBox(height: 16),
            Text(
              'No exercises for this date',
              style: themeState.themeData.textTheme.bodyLarge?.copyWith(
                color: themeState.themeData.textTheme.bodyLarge?.color
                    ?.withValues(alpha: 0.7),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
