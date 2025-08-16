import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'state.dart';

class AuthService extends ChangeNotifier {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  late final GoogleSignIn _googleSignIn;
  final AppState _appState;

  User? get currentUser => _appState.currentUser;
  bool get isLoggedIn => _appState.isLoggedIn;

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  AuthService(this._appState) {
    if (kIsWeb) {
      _googleSignIn = GoogleSignIn(
        clientId:
            '1050310982145-l2st4pl568fm9c8vausuvi76856c0ehk.apps.googleusercontent.com',
        scopes: ['email', 'profile'],
      );
    } else {
      _googleSignIn = GoogleSignIn(
        scopes: ['email', 'profile'],
      );
    }

    _appState.setCurrentUser(_auth.currentUser);
    
    _auth.authStateChanges().listen((User? user) {
      _appState.setCurrentUser(user);
    });
  }

  Future<UserCredential?> signInWithGoogle() async {
    try {
      // Check if user is already signed in
      if (_auth.currentUser != null) {
        return null;
      }

      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();

      if (googleUser == null) {
        return null;
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      final UserCredential userCredential =
          await _auth.signInWithCredential(credential);

      await _saveLoginState();

      return userCredential;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
      await _auth.signOut();

      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('user_logged_in');

      // User state is automatically updated via authStateChanges listener
    } catch (e) {
      rethrow;
    }
  }

  Future<void> _saveLoginState() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('user_logged_in', true);
  }
}
