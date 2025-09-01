class FieldDescriptor {
  final String name;
  final String label;
  final dynamic Function() getter;
  final void Function(dynamic) setter;
  final Type type;

  FieldDescriptor(this.name, this.label, this.getter, this.setter, this.type);
}
