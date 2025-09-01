import 'package:frontend/model/subcard.abstract.dart';
import 'package:frontend/model/utils.dart';
import 'package:json_annotation/json_annotation.dart';

abstract class CardAbstract extends EditableItemAbstract {
  bool _isCompleted = false;

  bool get isCompleted => _isCompleted;

  set isCompleted(bool value) {
    _isCompleted = value;
    if (value) {
      isExpanded = false;
    }
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  bool isExpanded = true;

  @JsonKey(includeFromJson: false, includeToJson: false)
  bool canAddItems = true;

  CardAbstract();

  @override
  List<FieldDescriptor> getEditableFields();
}
