import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'dart:io';
import 'package:flutter/material.dart';

// Forward declaration to avoid circular imports
abstract class AppStateInterface {
  bool get isLoading;
  set isLoading(bool value);
  void setState(void Function() updater);
  BuildContext? get context;
}

String get baseUrl {
  if (kDebugMode) {
    if (kIsWeb) {
      return 'http://localhost:8000';
    } else if (Platform.isAndroid) {
      return 'http://10.0.2.2:8000';
    } else {
      return 'http://localhost:8000';
    }
  } else {
    return 'https://life-automation-api-1050310982145.europe-west2.run.app';
  }
}

class ApiService {
  static void _showMessage(AppStateInterface? appState, String message, {bool isError = false}) {
    if (appState?.context != null) {
      ScaffoldMessenger.of(appState!.context!).showSnackBar(
        SnackBar(
          content: Text(message),
          backgroundColor: isError ? Colors.red : null,
          duration: const Duration(seconds: 3),
        ),
      );
    }
  }

  static Future<dynamic> request(
    String endpoint,
    String method, {
    Map<String, dynamic>? payload,
    AppStateInterface? appState,
  }) async {
  print('baseUrl: $baseUrl');
  
    // Set loading to true when request starts
    if (appState != null) {
      appState.setState(() => appState.isLoading = true);
    }
    
    try {
      final uri = Uri.parse('$baseUrl/$endpoint');
      final headers = {
        'Content-Type': 'application/json',
      };

      http.Response response;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await http.get(uri, headers: headers)
              .timeout(const Duration(seconds: 60));
          break;
        case 'POST':
          response = await http.post(
            uri,
            headers: headers,
            body: payload != null ? json.encode(payload) : null,
          ).timeout(const Duration(seconds: 60));
          break;
        case 'PUT':
          response = await http.put(
            uri,
            headers: headers,
            body: payload != null ? json.encode(payload) : null,
          ).timeout(const Duration(seconds: 60));
          break;
        case 'PATCH':
          response = await http.patch(
            uri,
            headers: headers,
            body: payload != null ? json.encode(payload) : null,
          ).timeout(const Duration(seconds: 60));
          break;
        case 'DELETE':
          response = await http.delete(uri, headers: headers)
              .timeout(const Duration(seconds: 60));
          break;
        default:
          // Set loading to false before throwing error
          if (appState != null) {
            appState.setState(() => appState.isLoading = false);
          }
          throw ArgumentError('Unsupported HTTP method: $method');
      }

      if (response.statusCode >= 200 && response.statusCode < 300) {
        // Set loading to false on success
        if (appState != null) {
          appState.setState(() => appState.isLoading = false);
        }
        
        if (response.body.isNotEmpty) {
          return json.decode(response.body);
        }
        return null; // For successful requests with empty body
      } else {
        print('API Error: ${response.statusCode} - ${response.body}');
        
        // Set loading to false on API error
        if (appState != null) {
          appState.setState(() => appState.isLoading = false);
        }
        
        // Show error message
        _showMessage(appState, 'API Error: ${response.statusCode}', isError: true);
        
        return null;
      }
    } catch (e) {
      print('Network Error: $e');
      
      // Set loading to false on network error
      if (appState != null) {
        appState.setState(() => appState.isLoading = false);
      }
      
      // Show network error message
      _showMessage(appState, 'Network Error: Unable to connect', isError: true);
      
      return null;
    }
  }

}
