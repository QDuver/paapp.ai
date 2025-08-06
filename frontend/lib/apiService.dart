import 'package:http/http.dart' as http;
import 'dart:convert';

// const String baseUrl = 'https://life-automation-api-1050310982145.europe-west2.run.app';
const String baseUrl = 'http://localhost:8000';

class ApiService {
  static Future<dynamic> request(
    String endpoint,
    String method, {
    Map<String, dynamic>? payload,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/$endpoint');
      final headers = {
        'Content-Type': 'application/json',
      };

      http.Response response;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await http.get(uri, headers: headers)
              .timeout(const Duration(seconds: 10));
          break;
        case 'POST':
          response = await http.post(
            uri,
            headers: headers,
            body: payload != null ? json.encode(payload) : null,
          ).timeout(const Duration(seconds: 10));
          break;
        case 'PUT':
          response = await http.put(
            uri,
            headers: headers,
            body: payload != null ? json.encode(payload) : null,
          ).timeout(const Duration(seconds: 10));
          break;
        case 'PATCH':
          response = await http.patch(
            uri,
            headers: headers,
            body: payload != null ? json.encode(payload) : null,
          ).timeout(const Duration(seconds: 10));
          break;
        case 'DELETE':
          response = await http.delete(uri, headers: headers)
              .timeout(const Duration(seconds: 10));
          break;
        default:
          throw ArgumentError('Unsupported HTTP method: $method');
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        if (response.body.isNotEmpty) {
          return json.decode(response.body);
        }
        return null; // For successful requests with empty body
      } else {
        print('API Error: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Network Error: $e');
      return null;
    }
  }

}
