import 'package:http/http.dart' as http;
import 'dart:convert';

const String baseUrl =
    'https://life-automation-api-1050310982145.europe-west2.run.app';

class ApiService {
  static Future<dynamic> get(String endpoint) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/$endpoint'),
        headers: {
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 10)); // Add timeout

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        print('API Error: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Network Error: $e');
      return null;
    }
  }

  // Helper function to format date as YYYY-MM-DD
  static String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  // Get exercise data for a specific date, or today if no date provided
  static Future<Map<String, dynamic>?> getExerciseDayByDate(
      [DateTime? date]) async {
    try {
      final targetDate = date ?? DateTime.now();
      final formattedDate = _formatDate(targetDate);

      final response = await get('exercises');

      if (response != null && response is List) {
        // Find the exercise day for the target date
        for (var exerciseDay in response) {
          if (exerciseDay['date'] == formattedDate) {
            // Clean up null attributes in exercises and ensure proper typing
            var exercises = exerciseDay['exercises'];
            if (exercises != null && exercises is List) {
              for (var exercise in exercises) {
                if (exercise is Map<String, dynamic>) {
                  // Remove completely null values but keep meaningful nulls
                  exercise.removeWhere((key, value) =>
                      value == null &&
                      !['weight_kg', 'repetitions', 'duration_sec', 'rest']
                          .contains(key));
                }
              }
              exerciseDay['exercises'] = exercises;
            }
            return exerciseDay as Map<String, dynamic>;
          }
        }
      }

      return null; // No exercise data found for the specified date
    } catch (e) {
      print('Error in getExerciseDayByDate: $e');
      return null;
    }
  }

  static Future<void> getExerciceDay(
    Function(void Function()) setState,
    void Function(bool isLoading, Map<String, dynamic>? exerciseDay)
        updateValues,
  ) async {
    // Set loading state
    setState(() {
      updateValues(true, null);
    });

    final exerciseDay = await getExerciseDayByDate();

    setState(() {
      updateValues(false, exerciseDay);
    });
  }
}

// @app.post("/update-db/{collection}/{doc_id}")
// def update_db_endpoint(collection: str, doc_id: str, request: UpdateFsRequest):
//     fs.update(collection=collection, doc_id=doc_id, path=request.path, value=request.value)

Future<void> updateExercice(
    String docId, int index, String key, dynamic value) async {
  print(
      'Updating exercise with docId: $docId and data: $key: $value at index: $index');
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/update-db/routine/$docId'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.encode({
        "path": ['exercises', index, key],
        "value": value
      }),
    );

    if (response.statusCode == 200) {
      print('Exercise updated successfully');
    } else {
      print('Failed to update exercise: ${response.statusCode}');
    }
  } catch (e) {
    print('Error updating exercise: $e');
  }
}
