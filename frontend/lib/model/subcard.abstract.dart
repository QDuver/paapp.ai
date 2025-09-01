import 'package:frontend/api.dart';
import 'package:frontend/model/utils.dart';
import 'package:frontend/state.dart';
import 'package:json_annotation/json_annotation.dart';

abstract class EditableItemAbstract {
  String name = '';
  @JsonKey(includeFromJson: false, includeToJson: false)
  List<String> tags = [];
  List<FieldDescriptor> getEditableFields();

  void updateFields(Map<String, dynamic> values, [dynamic obj]) {
    final fields = getEditableFields();
    for (final field in fields) {
      if (values.containsKey(field.name)) {
        final value = values[field.name];
        if (field.type == String) {
          field.setter(value as String);
        } else if (field.type == int) {
          field.setter(
            int.tryParse(value as String) ?? (field.getter() as int?),
          );
        } else if (field.type == double) {
          field.setter(
            double.tryParse(value as String) ?? (field.getter() as double?),
          );
        } else if (field.type == bool) {
          field.setter(value as bool);
        }
      }
    }
  }

  EditableItemAbstract? copyLastItem() {
    final items = (this as dynamic).items as List<dynamic>?;
    return items?.isEmpty ?? true ? null : items!.last as EditableItemAbstract;
  }

  EditableItemAbstract? createNewItem() => null;

  dynamic getFieldValue(String fieldName) {
    final fields = getEditableFields();
    final field = fields.firstWhere((f) => f.name == fieldName);
    return field.getter();
  }

  void update(
    AppState appState,
    dynamic obj,
    Map<String, dynamic> values,
  ) {
    updateFields(values, obj);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }

  void create<T>(
    AppState appState,
    dynamic obj,
    T parent,
    Map<String, dynamic> values,
  ) {
    updateFields(values);
    (parent as dynamic).items.add(this);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }

  void delete<T>(AppState appState, dynamic obj, T parent) {
    (parent as dynamic).items.remove(this);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }
}

abstract class SubCardAbstract extends EditableItemAbstract {
  @override
  List<FieldDescriptor> getEditableFields();
}
