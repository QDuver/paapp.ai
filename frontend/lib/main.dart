import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:frontend/screens/home.dart';
import 'package:provider/provider.dart';
import 'package:salomon_bottom_bar/salomon_bottom_bar.dart';

import 'auth.dart';
import 'components/app_bar.dart';
import 'components/card/card_list.dart';
import 'firebase_options.dart';
import 'model/routine.dart';
import 'model/exercise.dart';
import 'model/meal.dart';
import 'screens/login.dart';
import 'screens/settings.dart';
import 'state.dart';
import 'theme/theme_state.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});


  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<ThemeState>(create: (_) => ThemeState()),
        ChangeNotifierProvider<AppState>(create: (_) => AppState()),
        ChangeNotifierProxyProvider<AppState, AuthService>(
          create: (context) => AuthService(context.read<AppState>()),
          update: (context, appState, authService) => authService ?? AuthService(appState),
        ),
      ],
      child: MaterialApp(
        title: 'aiapps',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
            primarySwatch: Colors.blue, canvasColor: Colors.transparent),
        home: AuthWrapper(),
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<AppState, AuthService>(
      builder: (context, appState, authService, child) {
        // Show loading screen while checking authentication
        if (appState.isAuthChecking) {
          return Scaffold(
            backgroundColor: Colors.blue,
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.fitness_center,
                    size: 80,
                    color: Colors.white,
                  ),
                  SizedBox(height: 24),
                  Text(
                    'Life Automation',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 24),
                  CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                ],
              ),
            ),
          );
        }
        
        if (appState.isLoggedIn) {
          return Nav();
        }
        
        return const LoginScreen();
      },
    );
  }
}

class Nav extends StatefulWidget {
  const Nav({super.key});

  @override
  _NavState createState() => _NavState();
}

class _NavState extends State<Nav> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);

    
    // Set context for ApiService error messages
    WidgetsBinding.instance.addPostFrameCallback((_) {
      appState.setContext(context);
    });

    final navBarItems = appState.navigation.map((section) {
      return SalomonBottomBarItem(
        icon: Icon(section['icon']),
        title: Text(section['name']),
        selectedColor: themeState.themeData.colorScheme.secondary,
      );
    }).toList();

    return Scaffold(
      key: _scaffoldKey,
      body: Container(
        color: themeState.themeData.primaryColor,
        child: Column(
          children: [
            CustomAppBar(
              selectedIndex: appState.selectedNavigation,
              onMenuPressed: () {
                _scaffoldKey.currentState?.openDrawer();
              },
            ),
            if (appState.isLoading)
              LinearProgressIndicator(
                backgroundColor: themeState.themeData.primaryColor.withOpacity(0.3),
                valueColor: AlwaysStoppedAnimation<Color>(
                  themeState.themeData.colorScheme.secondary,
                ),
              ),
            Expanded(
              child: _getBodyWidget(appState.selectedNavigation, themeState, appState),
            ),
          ],
        ),
      ),
      drawer: Drawer(
        child: SettingsPage(),
      ),
      bottomNavigationBar: Container(
        color: themeState.themeData.primaryColor,
        child: SalomonBottomBar(
          backgroundColor: Colors.transparent,
          currentIndex: appState.selectedNavigation,
          selectedItemColor: const Color(0xff6200ee),
          unselectedItemColor: const Color(0xff757575),
          onTap: (index) {
            appState.setState(() => appState.selectedNavigation = index);
          },
          items: navBarItems,
        ),
      ),
    );
  }

  Widget _getBodyWidget(int index, ThemeState themeState, AppState appState) {
    switch (index) {
      case 0:
        return CardList<Routine>(
          items: appState.allRoutines,
          onItemsChanged: (updatedRoutines) async {
            appState.setState(() {
              if (appState.day != null) {
                appState.day!.routines = updatedRoutines;
              }
            });
            // Update each routine individually
            for (var routine in updatedRoutines) {
              await routine.updateDb();
            }
          },
          createNewItem: () => Routine(
            name: '',
            isCompleted: false,
            routineType: RoutineType.other,
          ),
        );
      case 1:
        return CardList<Exercise>(
          items: appState.individualExercises,
          onItemsChanged: (updatedExercises) async {
            await appState.updateIndividualExercises(updatedExercises);
            appState.setState(() {}); // Refresh the UI
          },
          createNewItem: () => Exercise(
            index: appState.individualExercises.length,
            name: '',
            isCompleted: false,
          ),
        );
      case 2:
        return CardList<Meal>(
          items: appState.individualMeals,
          onItemsChanged: (updatedMeals) async {
            await appState.updateIndividualMeals(updatedMeals);
            appState.setState(() {}); // Refresh the UI
          },
          createNewItem: () => Meal(
            name: '',
            isCompleted: false,
          ),
        );
      default:
        return HomePage();
    }
  }
}
