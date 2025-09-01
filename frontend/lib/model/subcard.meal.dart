import 'package:frontend/model/subcard.abstract.dart';
import 'package:frontend/model/utils.dart';
import 'package:json_annotation/json_annotation.dart';

part 'subcard.meal.g.dart';

@JsonSerializable()
class Ingredient extends SubCardAbstract {
  String name = '';
  
  double quantity = 0.0;
  
  int calories = 0;

  @JsonKey(defaultValue: false, includeToJson: false)
  bool isExpanded = false;

  Ingredient();

  factory Ingredient.fromJson(Map<String, dynamic> json) =>
      _$IngredientFromJson(json);
  Map<String, dynamic> toJson() => _$IngredientToJson(this);

  @override
  List<FieldDescriptor> getEditableFields() {
    return [
      FieldDescriptor('name', 'Name', () => name, (v) => name = v, String),
      FieldDescriptor('quantity', 'Quantity', () => quantity, (v) => quantity = v ?? 0.0, double),
      FieldDescriptor('calories', 'Calories', () => calories, (v) => calories = v ?? 0, int),
    ];
  }
}
