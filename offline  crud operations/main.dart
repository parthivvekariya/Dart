import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'Login.dart';
import 'Deshbord.dart'; // Assuming Deshbord is the dashboard screen

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: isLoggedIn(), // Check if the user is already logged in
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          // While waiting for the result, show a loading indicator
          return CircularProgressIndicator();
        } else {
          if (snapshot.data == true) {
            // If the user is logged in, navigate to the dashboard
            return MaterialApp(
              theme: ThemeData(primarySwatch: Colors.teal),
              home: Deshbord(), // Navigate to the dashboard
              debugShowCheckedModeBanner: false,
            );
          } else {
            // If the user is not logged in, show the login screen
            return MaterialApp(
              theme: ThemeData(primarySwatch: Colors.teal),
              home: LoginScreen(),
              debugShowCheckedModeBanner: false,
            );
          }
        }
      },
    );
  }

  Future<bool> isLoggedIn() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getBool('isLoggedIn') ?? false; // Default to false if isLoggedIn is not found
  }
}
