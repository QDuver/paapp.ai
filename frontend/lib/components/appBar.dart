import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/theme_state.dart';
import '../state.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final int selectedIndex;
  final Function(int) onNavigateDate;
  final VoidCallback onMenuPressed;
  final ThemeState themeState;

  const CustomAppBar({
    Key? key,
    required this.selectedIndex,
    required this.onNavigateDate,
    required this.onMenuPressed,
    required this.themeState,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = context.read<AppState>();

    return AppBar(
      leading: IconButton(
        icon: Icon(
          Icons.menu,
          color: themeState.themeData.colorScheme.secondary,
        ),
        onPressed: onMenuPressed,
      ),
      centerTitle: true,
      title: Text(
        appState.selectedNavigation == 1
            ? appState.formattedCurrentDate
            : appState.navigation[selectedIndex]['name'],
        style: themeState.themeData.textTheme.headlineSmall,
      ),
      backgroundColor: themeState.themeData.primaryColor,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
