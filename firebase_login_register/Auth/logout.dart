import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart'; // Import shared preferences package
import 'package:bistroboss/Auth/login.dart'; // Import your login screen

class LogoutHelper {
  static Future<void> logout(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    // Clear all stored credentials
    await prefs.remove('username');
    await prefs.remove('password');
    await prefs.remove('role');
    navigateToLoginScreen(context); // Navigate to the login screen after logout
  }

  static void navigateToLoginScreen(BuildContext context) {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => LoginScreen()),
    );
  }
}



// floatingActionButton: FloatingActionButton(
// onPressed: () async {
// await LogoutHelper.logout(context); // Call logout method from LogoutHelper
// },child: Icon(Icons.logout),
// ),