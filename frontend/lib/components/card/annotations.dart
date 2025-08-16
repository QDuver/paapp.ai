// Annotation to mark fields as editable in cards
class Editable {
  final String? label;
  final String? hint;
  final bool required;
  
  const Editable({
    this.label,
    this.hint,
    this.required = false,
  });
}

// Annotation to mark fields as sub-items
class SubItems {
  const SubItems();
}

// Annotation to mark the main display field
class DisplayName {
  const DisplayName();
}

// Annotation to mark completion status field
class CompletionField {
  const CompletionField();
}
