T safeFromJson<T>(
  String modelName, 
  Map<String, dynamic> json, 
  T Function(Map<String, dynamic>) fromJsonFunction
) {
  try {
    print('Parsing $modelName from JSON: $json');
    return fromJsonFunction(json);
  } catch (e, stackTrace) {
    print('❌ Error parsing $modelName from JSON');
    print('JSON data: $json');
    print('Error: $e');
    print('Stack trace: $stackTrace');
    
    print('\n🔍 Field analysis:');
    json.forEach((key, value) {
      print('  "$key": $value (${value.runtimeType})');
    });
    
    rethrow;
  }
}
