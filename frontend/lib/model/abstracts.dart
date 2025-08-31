import 'package:flutter/material.dart';
import 'package:frontend/api.dart';
import 'package:frontend/state.dart';
import 'package:json_annotation/json_annotation.dart';

class FieldDescriptor {
  final String name;
  final String label;
  final dynamic Function() getter;
  final void Function(dynamic) setter;
  final Type type;

  FieldDescriptor(this.name, this.label, this.getter, this.setter, this.type);
}

abstract class EditableItemAbstract {
  String name = '';
  List<String> tags = [];
  List<FieldDescriptor> getEditableFields();
  
  void updateFields(Map<String, dynamic> values) {
    final fields = getEditableFields();
    for (final field in fields) {
      if (values.containsKey(field.name)) {
        final value = values[field.name];
        if (field.type == String) {
          field.setter(value as String);
        } else if (field.type == int) {
          field.setter(int.tryParse(value as String) ?? (field.getter() as int?));
        } else if (field.type == double) {
          field.setter(double.tryParse(value as String) ?? (field.getter() as double?));
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
    ListAbstract obj,
    Map<String, dynamic> values,
  ) {
    updateFields(values);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }

  void create<T>(
    AppState appState,
    ListAbstract obj,
    T parent,
    Map<String, dynamic> values,
  ) {
    updateFields(values);
    (parent as dynamic).items.add(this);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }

  void delete<T>(AppState appState, ListAbstract obj, T parent) {
    (parent as dynamic).items.remove(this);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }
}

abstract class SubCardAbstract extends EditableItemAbstract {
  @override
  List<FieldDescriptor> getEditableFields();
}

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

abstract class ListAbstract<T extends CardAbstract> {
  IconData icon = Icons.help;
  String collection = '';
  String id = '';
  List<T> items = const [];
  ListAbstract();
  Map<String, dynamic> toJson();
  T? createNewItem();
}
