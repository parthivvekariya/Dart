import 'package:bistroboss/Chef/ChefHome.dart';
import 'package:bistroboss/Reception/ReceptionHome.dart';
import 'package:bistroboss/Ui/app_colors.dart';
import 'package:bistroboss/Ui/widgets/gold_top_clipper.dart';
import 'package:bistroboss/waiter/WaiterHome.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:lottie/lottie.dart';
import 'package:shared_preferences/shared_preferences.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final FirebaseAuth _auth = FirebaseAuth.instance;
  bool _isLoading = false;
  bool _passwordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Stack(
        children: [
          ClipPath(
            clipper: const GoldTopClipper(),
            child: Container(
                padding: EdgeInsets.all(50),
                child: Lottie.network(
                  "https://roasting-conflict.000webhostapp.com/lotti/restaurant.json",
                  // width: 100, // Adjust width as needed
                  // height: 100, // Adjust height as needed
                  repeat: true,
                  reverse: true,
                  animate: true,
                ), color: AppColors.primaryColor2
              //assets/Restaurant-Logo-PNG-Clipart.png
            ),
          ),
          Container(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[


                  Row(
                    children: [
                      Text("L", style: TextStyle(
                          fontSize: 30, fontWeight: FontWeight.bold),),
                      Text("ogin", style: TextStyle(
                          fontSize: 25, fontWeight: FontWeight.bold),),
                    ],
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  TextField(
                    controller: _usernameController,
                    decoration: InputDecoration(
                      labelText: 'Username',
                    ),
                  ),
                  SizedBox(height: 20.0),
                  TextField(
                    controller: _passwordController,
                    obscureText: !_passwordVisible,
                    // Use _passwordVisible state to determine visibility
                    decoration: InputDecoration(
                      labelText: 'Password',
                      suffixIcon: IconButton(
                        onPressed: () {
                          setState(() {
                            _passwordVisible =
                            !_passwordVisible; // Toggle password visibility
                          });
                        },
                        icon: Icon(
                          _passwordVisible ? Icons.visibility : Icons
                              .visibility_off,
                        ),
                      ),
                    ),
                  ),

                  SizedBox(height: 20.0),
                  ElevatedButton(
                    onPressed: _login,
                    child: Text('Login'),
                  ),


                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
        child: ElevatedButton(
          onPressed: () {
            // Action for the button
          },
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.store_mall_directory_outlined),
              Text('Create Restaurant')
            ],
          ),
        ),
      ),

    );
  }

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final String username = _usernameController.text.trim();
      final String password = _passwordController.text.trim();

      // Perform login with Firebase Authentication
      UserCredential userCredential = await _auth.signInWithEmailAndPassword(
        email: '$username@example.com', // Assuming username is the email
        password: password,
      );

      // Save user credentials using shared preferences
      SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString('username', username);
      prefs.setString('password', password);

      // Fetch user data from Firestore
      DocumentSnapshot userSnapshot = await FirebaseFirestore.instance
          .collection('staff')
          .doc(userCredential.user!.uid)
          .get();

      // Get user's role from Firestore
      String userRole = userSnapshot.get('role');

      // Save user role in shared preferences
      prefs.setString('role', userRole);

      // Navigate based on the user's role
      switch (userRole) {
        case 'waiter':
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => WaiterScreen()),
          );
          break;
        case 'chef':
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => ChefScreen()),
          );
          break;
        case 'reception':
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => ReceptionScreen()),
          );
          break;
        default:
        // Handle the case where the user's role is not recognized
          print('Unknown user role: $userRole');
      }
    } catch (error) {
      print('Error logging in: $error');
      // Handle error message display or any other action based on error.
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }
}
// https://roasting-conflict.000webhostapp.com/lotti/restaurant.json

