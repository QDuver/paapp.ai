import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

final ThemeData kLightTheme = _buildLightTheme();

ThemeData _buildLightTheme() {
  final ThemeData base = ThemeData.light();
  return base.copyWith(
    primaryColor: Colors.white,
    canvasColor: Colors.transparent,
    primaryIconTheme: IconThemeData(color: Colors.black),
    textTheme: TextTheme(
      headlineSmall: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.black, fontSize: 24),
      headlineMedium: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.black, fontSize: 28),
      bodyMedium: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.black, fontSize: 18),
      bodyLarge: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.black, fontSize: 16),
      bodySmall: GoogleFonts.inter(
          fontWeight: FontWeight.normal, color: Colors.black, fontSize: 14),
    ),
    colorScheme:
        ColorScheme.fromSwatch().copyWith(secondary: Color(0xff8468DD)),
  );
}

final ThemeData kDarkTheme = _buildDarkTheme();

ThemeData _buildDarkTheme() {
  final ThemeData base = ThemeData.dark();
  return base.copyWith(
    primaryColor: Color(0xff242248),
    canvasColor: Colors.transparent,
    primaryIconTheme: IconThemeData(color: Colors.black),
    textTheme: TextTheme(
      headlineSmall: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.white, fontSize: 24),
      headlineMedium: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.white, fontSize: 28),
      bodyMedium: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18),
      bodyLarge: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16),
      bodySmall: GoogleFonts.inter(
          fontWeight: FontWeight.normal, color: Colors.white, fontSize: 14),
    ),
    colorScheme:
        ColorScheme.fromSwatch().copyWith(secondary: Color(0xff8468DD)),
  );
}

final ThemeData kAmoledTheme = _buildAmoledTheme();

ThemeData _buildAmoledTheme() {
  final ThemeData base = ThemeData.dark();
  return base.copyWith(
    primaryColor: Colors.black,
    canvasColor: Colors.transparent,
    primaryIconTheme: IconThemeData(color: Colors.black),
    textTheme: TextTheme(
      headlineSmall: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.white, fontSize: 24),
      headlineMedium: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.white, fontSize: 28),
      bodyMedium: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18),
      bodyLarge: GoogleFonts.inter(
          fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16),
      bodySmall: GoogleFonts.inter(
          fontWeight: FontWeight.normal, color: Colors.white, fontSize: 14),
    ),
    colorScheme: ColorScheme.fromSwatch().copyWith(secondary: Colors.white),
  );
}
