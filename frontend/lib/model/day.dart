import 'package:frontend/model/routine.dart';

class Day {
  String day;
  String? wakeupTime;
  List<Routine> routines;
  
  Day({
    required this.day,
    this.wakeupTime,
    this.routines = const [],
  });

  factory Day.fromJson(Map<String, dynamic> json) {
    return Day(
      day: json['day'] as String,
      wakeupTime: json['wakeupTime'] as String?,
      routines: (json['routines'] as List<dynamic>?)
              ?.map((item) => Routine.fromJson(item as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      if (wakeupTime != null) 'wakeupTime': wakeupTime,
      'routines': routines.map((r) => r.toJson()).toList(),
    };
  }

  // Helper methods to filter routines by type
  List<Routine> get allRoutines => routines;
  
  List<Routine> get exerciseRoutines => 
      routines.where((r) => r.routineType == RoutineType.exercises).toList();
  
  List<Routine> get mealRoutines => 
      routines.where((r) => r.routineType == RoutineType.meal).toList();
  
  List<Routine> get otherRoutines => 
      routines.where((r) => r.routineType == RoutineType.other).toList();

  static List<Day> fromJsonList(dynamic result) {
    return (result as List<dynamic>)
        .map((item) => Day.fromJson(item as Map<String, dynamic>))
        .toList();
  }
}