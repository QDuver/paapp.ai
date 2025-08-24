import 'package:frontend/components/card/annotations.dart';
import 'package:frontend/components/card/reflection_helper.dart';

enum MealType { breakfast, lunch, dinner }

// Simple data class for display-only information
class MealInfo {
  final String label;
  final String value;
  
  MealInfo(this.label, this.value);
  
  @override
  String toString() => '$label: $value';
}



class Meal implements CardItem {

  @DisplayName()
  @Editable(label: "Meal Name", required: true)
  String name;

  @SubItems()
  List<String>? ingredients;

  @Editable(label: "Instructions")
  String? instructions;

  @Editable(label: "Calories")
  int? calories;

  @CompletionField()
  bool isCompleted;

  Meal({
    required this.name,
    this.ingredients,
    this.instructions,
    this.calories,
    this.isCompleted = false,
  });

  @override
  String getDisplayName() => name;

  @override
  bool getCompletionStatus() => isCompleted;

  @override
  void setCompletionStatus(bool completed) {
    isCompleted = completed;
  }

  @override
  List<dynamic> getSubItems() {
    List<MealInfo> details = [];
    
    // Add instructions if available
    if (instructions != null && instructions!.isNotEmpty) {
      details.add(MealInfo('Instructions', instructions!));
    }
    
    // Add calories if available
    if (calories != null) {
      details.add(MealInfo('Calories', calories.toString()));
    }
    
    // Add ingredients as a comma-separated list
    if (ingredients != null && ingredients!.isNotEmpty) {
      String ingredientsList = ingredients!.where((name) => name.isNotEmpty).join(', ');
      if (ingredientsList.isNotEmpty) {
        details.add(MealInfo('Ingredients', ingredientsList));
      }
    }
    
    return details;
  }

  @override
  bool canAddSubItems() => false; // Meal details are managed through the edit dialog

  @override
  void addSubItem() {} // Meal details are managed through the edit dialog

  @override
  CardItem? createNewSubItem() => null; // Meal details are managed through the edit dialog

  @override
  void removeSubItem(int index) {} // Meal details are managed through the edit dialog

  @override
  List<FieldInfo> getEditableFields() {
    return [
      FieldInfo(
        name: 'name',
        label: 'Meal Name',
        value: name,
        required: true,
        type: String,
      ),
      FieldInfo(
        name: 'instructions',
        label: 'Instructions',
        value: instructions,
        required: false,
        type: String,
      ),
      FieldInfo(
        name: 'calories',
        label: 'Calories',
        value: calories,
        required: false,
        type: int,
      ),
    ];
  }

  @override
  void updateFields(Map<String, dynamic> values) {
    if (values.containsKey('name')) {
      name = values['name']?.toString() ?? name;
    }
    if (values.containsKey('instructions')) {
      instructions = values['instructions']?.toString();
    }
    if (values.containsKey('calories')) {
      calories = _parseInt(values['calories']);
    }
  }

  factory Meal.fromJson(Map<String, dynamic> json) {
    return Meal(
      name: json['name'] as String,
      ingredients: (json['ingredients'] as List<dynamic>?)
          ?.map((item) => item as String)
          .toList(),
      instructions: json['instructions'] as String?,
      calories: json['calories'] as int?,
      isCompleted: json['isCompleted'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      if (ingredients != null) 'ingredients': ingredients,
      if (instructions != null) 'instructions': instructions,
      if (calories != null) 'calories': calories,
      'isCompleted': isCompleted,
    };
  }

  int? _parseInt(dynamic value) {
    if (value == null || value == '') return null;
    if (value is int) return value;
    if (value is double) return value.toInt();
    if (value is String) return int.tryParse(value);
    return null;
  }

}