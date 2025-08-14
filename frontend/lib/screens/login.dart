import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../auth.dart';
import '../theme/theme_state.dart';
import '../state.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  Future<void> _signInWithGoogle() async {
    final appState = Provider.of<AppState>(context, listen: false);
    final authService = Provider.of<AuthService>(context, listen: false);
    print('authService.isLoggedIn: ${authService.isLoggedIn}');
    if (authService.isLoggedIn) {
      print('User is already logged in, skipping sign-in');
      return;
    }
    
    appState.setState(() {
      // appState.isLoading = true;
    });

    try {
      await authService.signInWithGoogle();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to sign in: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        appState.setState(() {
          appState.isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeState = Provider.of<ThemeState>(context);
    final appState = Provider.of<AppState>(context);
    
    return Scaffold(
      backgroundColor: themeState.themeData.primaryColor,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // App Logo/Title
                Icon(
                  Icons.fitness_center,
                  size: 80,
                  color: themeState.themeData.colorScheme.secondary,
                ),
                const SizedBox(height: 24),
                Text(
                  'Life Automation',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: themeState.themeData.colorScheme.onPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Track your fitness and nutrition journey',
                  style: TextStyle(
                    fontSize: 16,
                    color: themeState.themeData.colorScheme.onPrimary.withOpacity(0.8),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),
                
                // Google Sign In Button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton.icon(
                    onPressed: appState.isLoading ? null : _signInWithGoogle,
                    icon: appState.isLoading 
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : Image.asset(
                            'assets/images/google_logo.png',
                            height: 20,
                            width: 20,
                            errorBuilder: (context, error, stackTrace) => const Icon(
                              Icons.login,
                              size: 20,
                            ),
                          ),
                    label: Text(
                      appState.isLoading ? 'Signing In...' : 'Continue with Google',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black87,
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Terms and Privacy
                Text(
                  'By continuing, you agree to our Terms of Service\nand Privacy Policy',
                  style: TextStyle(
                    fontSize: 12,
                    color: themeState.themeData.colorScheme.onPrimary.withOpacity(0.6),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
