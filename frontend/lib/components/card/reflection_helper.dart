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
    required this.required,
    this.hint,
    required this.type,
  });
}

// Interface for objects that can be used with generic cards
abstract class CardItem {
  String getDisplayName();
  bool getCompletionStatus();
  void setCompletionStatus(bool completed);
  List<dynamic> getSubItems();
  List<FieldInfo> getEditableFields();
  void updateFields(Map<String, dynamic> values);
  
  // Methods for managing sub-items
  bool canAddSubItems();
  void addSubItem();
  CardItem? createNewSubItem(); // Create a template for a new sub-item
  void removeSubItem(int index); // Remove a sub-item at the given index
}
