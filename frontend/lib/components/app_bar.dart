import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/theme_state.dart';
import '../state.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final int selectedIndex;
  final VoidCallback onMenuPressed;

  const CustomAppBar({
    Key? key,
    required this.selectedIndex,
    required this.onMenuPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final themeState = context.read<ThemeState>();
    final appState = context.watch<AppState>();
    
    return AppBar(
      leading: IconButton(
        icon: Icon(
          Icons.menu,
          color: themeState.themeData.colorScheme.secondary,
        ),
        onPressed: onMenuPressed,
      ),
      title: _buildDateNavigation(context, themeState, appState),
      centerTitle: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
    );
  }

  Widget _buildDateNavigation(BuildContext context, ThemeState themeState, AppState appState) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          onPressed: () {
            appState.setState(() {
              appState.currentDate = appState.currentDate.subtract(Duration(days: 1));
            });
          },
          icon: Icon(
            Icons.chevron_left,
            color: themeState.themeData.textTheme.headlineSmall?.color,
            size: 32,
          ),
        ),
        Flexible(
          child: Text(
            appState.formattedCurrentDate,
            style: themeState.themeData.textTheme.headlineSmall?.copyWith(
              color: themeState.themeData.colorScheme.secondary,
            ),
          ),
        ),
        IconButton(
          onPressed: () {
            appState.setState(() {
              appState.currentDate = appState.currentDate.add(Duration(days: 1));
            });
          },
          icon: Icon(
            Icons.chevron_right,
            color: themeState.themeData.textTheme.headlineSmall?.color,
            size: 32,
          ),
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
