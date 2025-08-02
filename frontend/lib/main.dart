import 'package:flutter/material.dart';
import 'package:frontend/models/types.dart';
import 'package:provider/provider.dart';
import 'screens/settings.dart';
import 'screens/exercice.dart';
import 'theme/theme_state.dart';
import 'package:salomon_bottom_bar/salomon_bottom_bar.dart';
import 'api.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<ThemeState>(
      create: (_) => ThemeState(),
      child: MaterialApp(
        title: 'Matinee',
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
  int selectedIndex = 0; // Start with Home tab
  ExerciseDay? _exerciseDay;
  bool _isLoadingExercises = false;
  DateTime _currentDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    // Don't load data immediately - load only when needed
  }

  Future<void> _loadExerciseData(DateTime date) async {
    setState(() {
      _currentDate = date;
      _isLoadingExercises = true;
    });

    try {
      final exerciseDayData = await ApiService.getExerciseDayByDate(date);

      setState(() {
        _isLoadingExercises = false;
        if (exerciseDayData != null) {
          _exerciseDay = ExerciseDay.fromJson(exerciseDayData);
        } else {
          _exerciseDay = null;
        }
      });
    } catch (e) {
      setState(() {
        _isLoadingExercises = false;
        _exerciseDay = null;
      });
      print('Error loading exercise data: $e');
    }
  }

  Future<void> _loadExerciseDataForDate(DateTime date) async {
    setState(() {
      _isLoadingExercises = true;
      _currentDate = date;
    });

    try {
      final exerciseDayData = await ApiService.getExerciseDayByDate(date);

      setState(() {
        _isLoadingExercises = false;
        if (exerciseDayData != null) {
          _exerciseDay = ExerciseDay.fromJson(exerciseDayData);
        } else {
          _exerciseDay = null;
        }
      });
    } catch (e) {
      setState(() {
        _isLoadingExercises = false;
        _exerciseDay = null;
      });
      print('Error loading exercise data for date $date: $e');
    }
  }

  void _navigateDate(int direction) {
    final newDate = _currentDate.add(Duration(days: direction));
    _loadExerciseDataForDate(newDate);
  }

  @override
  Widget build(BuildContext context) {
    final state = Provider.of<ThemeState>(context);

    final List<Map<String, dynamic>> sections = [
      {'name': 'Home', 'icon': Icons.home},
      {'name': 'Exercises', 'icon': Icons.fitness_center},
      {'name': 'Nutrition', 'icon': Icons.restaurant}
    ];

    final navBarItems = sections.map((section) {
      return SalomonBottomBarItem(
        icon: Icon(section['icon']),
        title: Text(section['name']),
        selectedColor: state.themeData.colorScheme.secondary,
      );
    }).toList();

    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(
            Icons.menu,
            color: state.themeData.colorScheme.secondary,
          ),
          onPressed: () {
            _scaffoldKey.currentState?.openDrawer();
          },
        ),
        centerTitle: true,
        title: selectedIndex == 1
            ? Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: Icon(
                      Icons.arrow_back_ios,
                      color: state.themeData.colorScheme.secondary,
                      size: 20,
                    ),
                    onPressed: () => _navigateDate(-1),
                  ),
                  Text(
                    _getAppBarTitle(selectedIndex),
                    style: state.themeData.textTheme.headlineSmall,
                  ),
                  IconButton(
                    icon: Icon(
                      Icons.arrow_forward_ios,
                      color: state.themeData.colorScheme.secondary,
                      size: 20,
                    ),
                    onPressed: () => _navigateDate(1),
                  ),
                ],
              )
            : Text(
                _getAppBarTitle(selectedIndex),
                style: state.themeData.textTheme.headlineSmall,
              ),
        backgroundColor: state.themeData.primaryColor,
      ),
      drawer: Drawer(
        child: SettingsPage(),
      ),
      body: _getBodyWidget(selectedIndex, state),
      bottomNavigationBar: SalomonBottomBar(
        backgroundColor: state.themeData.primaryColor,
        currentIndex: selectedIndex,
        selectedItemColor: const Color(0xff6200ee),
        unselectedItemColor: const Color(0xff757575),
        onTap: (index) {
          setState(() {
            print('On tap: $index');
            selectedIndex = index;
            // Load exercise data only when user navigates to exercises tab
            if (index == 1 && _exerciseDay == null && !_isLoadingExercises) {
              _loadExerciseData(_currentDate);
            }
          });
        },
        items: navBarItems,
      ),
    );
  }

  String _getAppBarTitle(int index) {
    final List<Map<String, dynamic>> sections = [
      {'name': 'Home', 'icon': Icons.home},
      {'name': 'Exercises', 'icon': Icons.fitness_center},
      {'name': 'Nutrition', 'icon': Icons.restaurant}
    ];

    if (index == 1) {
      // Format the current date nicely for exercises tab
      final formattedDate =
          '${_currentDate.year}-${_currentDate.month.toString().padLeft(2, '0')}-${_currentDate.day.toString().padLeft(2, '0')}';
      return formattedDate;
    }

    return sections[index]['name'];
  }

  Widget _getBodyWidget(int index, ThemeState state) {
    switch (index) {
      case 0: // Home
        return Container(
          color: state.themeData.primaryColor,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.home,
                    size: 80,
                    color:
                        state.themeData.colorScheme.secondary.withOpacity(0.5),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Welcome to your very own App, built just for you',
                    style: state.themeData.textTheme.headlineMedium,
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 8),
                ],
              ),
            ),
          ),
        );
      case 1: // Exercises
        return ExercicePage(
          exerciseDay: _exerciseDay,
          isLoading: _isLoadingExercises,
        );
      case 2: // Nutrition
        return Container(
          color: state.themeData.primaryColor,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.restaurant,
                  size: 80,
                  color: state.themeData.colorScheme.secondary.withOpacity(0.5),
                ),
                SizedBox(height: 16),
                Text(
                  'Nutrition',
                  style: state.themeData.textTheme.headlineMedium,
                ),
                SizedBox(height: 8),
                Text(
                  'Coming soon!',
                  style: state.themeData.textTheme.bodyLarge?.copyWith(
                    color: state.themeData.textTheme.bodyLarge?.color
                        ?.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        );
      default:
        return Container(
          color: state.themeData.primaryColor,
          child: Center(
            child: Text(
              'Page not found',
              style: state.themeData.textTheme.headlineMedium,
            ),
          ),
        );
    }
  }
}
