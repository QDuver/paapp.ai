import 'package:flutter/material.dart';
import 'package:frontend/screens/home.dart';
import 'package:frontend/screens/nutrition.dart';
import 'package:provider/provider.dart';
import 'screens/settings.dart';
import 'screens/exercises/exercises.dart';
import 'theme/theme_state.dart';
import 'state.dart';
import 'package:salomon_bottom_bar/salomon_bottom_bar.dart';
import 'components/appBar.dart';

void main() {
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
      ],
      child: MaterialApp(
        title: 'App For You',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
            primarySwatch: Colors.blue, canvasColor: Colors.transparent),
        home: MyHomePage(),
      ),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);

    final navBarItems = appState.navigation.map((section) {
      return SalomonBottomBarItem(
        icon: Icon(section['icon']),
        title: Text(section['name']),
        selectedColor: themeState.themeData.colorScheme.secondary,
      );
    }).toList();

    return Scaffold(
      key: _scaffoldKey,
      appBar: CustomAppBar(
        selectedIndex: appState.selectedNavigation,
        onMenuPressed: () {
          _scaffoldKey.currentState?.openDrawer();
        },
      ),
      drawer: Drawer(
        child: SettingsPage(),
      ),
      body: _getBodyWidget(appState.selectedNavigation, themeState, appState),
      bottomNavigationBar: SalomonBottomBar(
        backgroundColor: themeState.themeData.primaryColor,
        currentIndex: appState.selectedNavigation,
        selectedItemColor: const Color(0xff6200ee),
        unselectedItemColor: const Color(0xff757575),
        onTap: (index) {
          appState.setState(() => appState.selectedNavigation = index);
        },
        items: navBarItems,
      ),
    );
  }

  Widget _getBodyWidget(int index, ThemeState themeState, AppState appState) {
    switch (index) {
      case 0:
        return HomePage();
      case 1:
        return ExercicePage();
      case 2:
        return NutritionPage();
      default:
        return HomePage();
    }
  }
}
