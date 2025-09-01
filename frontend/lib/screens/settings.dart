import 'package:flutter/material.dart';
import 'package:frontend/theme/theme_state.dart';
import 'package:frontend/auth.dart';
import 'package:frontend/state.dart';
import 'package:provider/provider.dart';

class SettingsPage extends StatefulWidget {
  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  int? option;
  final List<Color> colors = [Colors.white, Color(0xff242248), Colors.black];
  final List<Color> borders = [Colors.black, Colors.white, Colors.white];
  final List<String> themes = ['Light', 'Dark', 'Amoled'];

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);
    final authService = Provider.of<AuthService>(context, listen: false);
    
    return Theme(
        data: state.themeData,
        child: Container(
          color: state.themeData.primaryColor,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Expanded(
                child: Center(
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        // User Profile Section
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            children: [
                              CircleAvatar(
                                backgroundColor: state.themeData.colorScheme.secondary,
                                radius: 40,
                                backgroundImage: appState.currentUser?.photoURL != null ? NetworkImage(appState.currentUser!.photoURL!) : null,
                                child: appState.currentUser?.photoURL == null
                                    ? Icon(
                                        Icons.person_outline,
                                        size: 40,
                                        color: state.themeData.primaryColor,
                                      )
                                    : null,
                              ),
                              const SizedBox(height: 12),
                              if (appState.currentUser != null)
                                Text(
                                  appState.currentUser!.displayName!,
                                  style: state.themeData.textTheme.titleLarge?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              if (appState.currentUser?.email != null)
                                Text(
                                  appState.currentUser!.email!,
                                  style: state.themeData.textTheme.bodyMedium?.copyWith(
                                    color: state.themeData.colorScheme.onPrimary.withOpacity(0.7),
                                  ),
                                ),
                            ],
                          ),
                        ),
                        // Logout Button
                        if (appState.isLoggedIn)
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16.0),
                            child: SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                onPressed: () async {
                                  try {
                                    await authService.signOut();
                                    if (context.mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Signed out successfully')),
                                      );
                                    }
                                  } catch (e) {
                                    if (context.mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Error signing out: $e')),
                                      );
                                    }
                                  }
                                },
                                icon: const Icon(Icons.logout),
                                label: const Text('Sign Out'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                  foregroundColor: Colors.white,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
              ListTile(
                title: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text(
                      'Theme',
                      style: state.themeData.textTheme.bodyLarge,
                    ),
                  ],
                ),
                subtitle: SizedBox(
                  height: 100,
                  child: Center(
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      shrinkWrap: true,
                      itemCount: 3,
                      itemBuilder: (BuildContext context, int index) {
                        return Stack(
                          children: <Widget>[
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              children: <Widget>[
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Container(
                                    width: 50,
                                    height: 50,
                                    decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                            width: 2, color: borders[index]),
                                        color: colors[index]),
                                  ),
                                ),
                                Text(themes[index],
                                    style: state.themeData.textTheme.bodyLarge)
                              ],
                            ),
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              children: <Widget>[
                                Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: InkWell(
                                    onTap: () {
                                      setState(() {
                                        switch (index) {
                                          case 0:
                                            state.saveOptionValue(
                                                ThemeStateEnum.light);
                                            break;
                                          case 1:
                                            state.saveOptionValue(
                                                ThemeStateEnum.dark);
                                            break;
                                          case 2:
                                            state.saveOptionValue(
                                                ThemeStateEnum.amoled);

                                            break;
                                        }
                                      });
                                    },
                                    child: Container(
                                      width: 50,
                                      height: 50,
                                      child: state.themeData.primaryColor ==
                                              colors[index]
                                          ? Icon(Icons.done,
                                              color: state.themeData.colorScheme
                                                  .secondary)
                                          : Container(),
                                    ),
                                  ),
                                ),
                                Text(themes[index],
                                    style: state.themeData.textTheme.bodyLarge)
                              ],
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                ),
              ),
            ],
          ),
        ));
  }
}
