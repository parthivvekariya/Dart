import 'package:bistroboss/Auth/login.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';



class Registration extends StatefulWidget {
  const Registration({Key? key}) : super(key: key);

  @override
  State<Registration> createState() => _RegistrationState();
}

class _RegistrationState extends State<Registration> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final CollectionReference _addUser =
  FirebaseFirestore.instance.collection('staff');
  bool _isLoading = false;
  String _selectedRole = 'waiter'; // Default role is waiter

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Registration'),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            TextField(
              controller: _usernameController,
              decoration: InputDecoration(
                labelText: 'Username',
              ),
            ),
            SizedBox(height: 20.0),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Password',
              ),
            ),
            SizedBox(height: 20.0),
            DropdownButton<String>(
              value: _selectedRole,
              onChanged: (String? newValue) {
                setState(() {
                  _selectedRole = newValue!;
                });
              },
              items: <String>['waiter', 'chef', 'reception']
                  .map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
            SizedBox(height: 20.0),
            ElevatedButton(
              onPressed: _register,
              child: Text('Register'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _register() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final String username = _usernameController.text.trim();
      final String password = _passwordController.text.trim();

      // Check if password meets minimum length requirement
      if (password.length < 6) {
        throw 'Password should be at least 6 characters';
      }

      // Perform registration with Firebase Authentication
      UserCredential userCredential = await _auth.createUserWithEmailAndPassword(
        email: '$username@example.com', // Use username as email (it's unique)
        password: password,
      );

      // After registration, store user information in Firestore database
      await _addUser.doc(userCredential.user!.uid).set({
        'username': username,
        'password': password, // Include password in Firestore
        'role': _selectedRole,
      });

      // Navigate to the login screen after successful registration
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );

    } catch (error) {
      print('Error registering: $error');
      // Handle error message display or any other action based on error.
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

}
