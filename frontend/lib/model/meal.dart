import 'package:frontend/components/card/abstracts.dart';
import 'package:json_annotation/json_annotation.dart';

part 'meal.g.dart';

@JsonEnum()
enum MealType { breakfast, lunch, dinner }

// Simple data class for display-only information
class MealInfo {
  final String label;
  final String value;
  
  MealInfo(this.label, this.value);
  
  @override
  String toString() => '$label: $value';
}



@JsonSerializable()
class Meal extends CardAbstract {

  String name;

  List<String>? ingredients;

  String? instructions;

  int? calories;

  @JsonKey(defaultValue: false)
  bool isCompleted;
  
  @JsonKey(defaultValue: false, includeToJson: false)
  bool isExpanded;

  Meal({
    required this.name,
    this.ingredients,
    this.instructions,
    this.calories,
    this.isCompleted = false,
    this.isExpanded = false,
  });

  String getDisplayName() => name;

  bool getCompletionStatus() => isCompleted;

  void setCompletionStatus(bool completed) {
    isCompleted = completed;
  }

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
  List<FieldInfo> getEditableFields() {
    return [
      FieldInfo(
        name: 'name',
        label: 'Meal Name',
        value: name,
        required: true,
      ),
      FieldInfo(
        name: 'instructions',
        label: 'Instructions',
        value: instructions,
      ),
      FieldInfo(
        name: 'calories',
        label: 'Calories',
        value: calories,
        type: int,
      ),
    ];
  }

  @override
  void updateFields(Map<String, dynamic> values) {
    updateFieldsHelper<String>(values, 'name', (value) => name = value);
    updateFieldsHelper<bool>(values, 'isCompleted', (value) => isCompleted = value);
    updateFieldsHelper(values, 'instructions', (value) => instructions = value?.toString());
    updateFieldsHelper(values, 'calories', (value) => calories = _parseInt(value));
  }

  factory Meal.fromJson(Map<String, dynamic> json) => _$MealFromJson(json);

  Map<String, dynamic> toJson() => _$MealToJson(this);

  int? _parseInt(dynamic value) {
    if (value == null || value == '') return null;
    if (value is int) return value;
    if (value is double) return value.toInt();
    if (value is String) return int.tryParse(value);
    return null;
  }


}