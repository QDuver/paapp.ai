import 'package:flutter/material.dart';
import 'package:frontend/api.dart';
import 'package:frontend/state.dart';
import 'package:json_annotation/json_annotation.dart';

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

abstract class SubCardAbstract {
  @JsonKey(includeToJson: false)
  String? subtitle;
  @JsonKey(includeToJson: false)
  String? description;
  @JsonKey(includeToJson: false)
  List<String>? tags;
}


abstract class CardAbstract {
  bool isExpanded = true;
  bool isCompleted = false;
  String name = '';

  CardAbstract({
    this.isExpanded = true,
    this.isCompleted = false,
    this.name = '',
  });

  List<FieldInfo> getEditableFields();

  void update(AppState appState, MetaAbstract obj, Map<String, dynamic> values) {
    updateFields(values);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }

  void delete(AppState appState, MetaAbstract obj) {
    obj.items.remove(this);
    appState.setState(() {});
    ApiService.updateDocument(appState, obj);
  }

  void updateFields(Map<String, dynamic> values);

  void updateFieldsHelper<T>(Map<String, dynamic> values, String key, void Function(T) setter) {
    if (values.containsKey(key)) {
      setter(values[key] as T);
    }
  }
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
}
