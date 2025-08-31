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
      // title: _buildDateNavigation(context, themeState, appState),
      centerTitle: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
