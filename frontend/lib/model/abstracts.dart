import 'package:flutter/material.dart';
import 'package:frontend/api.dart';
import 'package:frontend/state.dart';

// Simple field descriptor for generic cards
class FieldInfo {
  final String name;
  final String label;
  final dynamic value;
  final bool required;
  final String? hint;
  final Type type;

  FieldInfo({
    required this.name,
    required this.label,
    required this.value,
    this.required = false,
    this.hint,
    this.type = String,
  });
}

abstract class EditableItem {
  String name = '';
  List<FieldInfo> getEditableFields();
  void updateFields(Map<String, dynamic> values);

  void updateFieldsHelper<T>(
    Map<String, dynamic> values,
    String key,
    void Function(T) setter,
  ) {
    if (values.containsKey(key)) {
      setter(values[key] as T);
    }
  }

  EditableItem? copyLastItem() {
    final items = (this as dynamic).items as List<dynamic>?;
    return items?.isEmpty ?? true ? null : items!.last as EditableItem;
  }

  EditableItem? createNewItem() => null;

  void update(
    AppState appState,
    MetaAbstract obj,
    Map<String, dynamic> values,
  ) {
    updateFields(values);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }

  void create<T>(
    AppState appState,
    MetaAbstract obj,
    T parent,
    Map<String, dynamic> values,
  ) {
    updateFields(values);
    (parent as dynamic).items.add(this);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }

  void delete<T>(AppState appState, MetaAbstract obj, T parent) {
    (parent as dynamic).items.remove(this);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }
}

abstract class SubCardAbstract extends EditableItem {
  @override
  List<FieldInfo> getEditableFields();

  @override
  void updateFields(Map<String, dynamic> values);
}

abstract class CardAbstract extends EditableItem {
  bool isExpanded = true;
  bool isCompleted = false;
  bool canAddItems = true;

  CardAbstract({
    this.isExpanded = true, 
    this.isCompleted = false,
    this.canAddItems = true,
  });

  @override
  List<FieldInfo> getEditableFields();

  @override
  void updateFields(Map<String, dynamic> values);
}

abstract class MetaAbstract<T extends CardAbstract> {
  IconData icon;
  String collection;
  String id;
  List<T> items;
  MetaAbstract({
    required this.collection,
    required this.id,
    required this.icon,
    required this.items,
  });
  Map<String, dynamic> toJson();
  
  T? createNewItem();
}
