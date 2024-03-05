import 'package:flutter/material.dart';

import 'Login.dart';
import 'db.dart';



class Registration extends StatefulWidget {
  const Registration({Key? key}) : super(key: key);

  @override
  State<Registration> createState() => _RegistrationState();
}

class _RegistrationState extends State<Registration> {
  final TextEditingController username = TextEditingController();
  final TextEditingController number = TextEditingController();
  final TextEditingController email = TextEditingController();
  final TextEditingController password = TextEditingController();


  bool _isLoading = false;
  bool _passwordVisible = false;

  MyDb mydb = MyDb();

  @override
  void initState()
  {
    super.initState();
    mydb.open();
  }


  Future<void> _register(BuildContext context) async {
    try {
      await mydb.db.rawInsert("INSERT INTO User (username, number, email, password) VALUES (?, ?, ?, ?);",
          [username.text, number.text, email.text, password.text]);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("New User Added")));
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
      );
    } catch (e) {
      print("Error inserting user: $e");
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error registering user")));
    }
  }



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
            SizedBox(height: 20.0),
            TextField(
              controller: username,
              decoration: InputDecoration(
                labelText: 'User Name',
              ),
            ),
            SizedBox(height: 20.0),
            TextField(
              controller: number,
              decoration: InputDecoration(
                labelText: 'Mobile Number',
              ),
            ),
            SizedBox(height: 20.0),
            TextFormField(
              controller: email,
              decoration: InputDecoration(
                labelText: 'Email-ID',
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter Email';
                }
                if (!RegExp(r'^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$')
                    .hasMatch(value)) {
                  return 'Please enter a valid email address';

                }
                return null;
              },
            ),

            SizedBox(height: 20.0),
            TextField(
              controller: password,
              obscureText: !_passwordVisible,
              decoration: InputDecoration(
                labelText: 'Password',
                suffixIcon: IconButton(
                  onPressed: () {
                    setState(() {
                      _passwordVisible = !_passwordVisible;
                    });
                  },
                  icon: Icon(
                    _passwordVisible
                        ? Icons.visibility
                        : Icons.visibility_off,
                  ),
                ),
              ),
            ),
            SizedBox(height: 20.0),
            ElevatedButton(
              onPressed: () {
                // Wrap _register() call with Future.delayed to execute it after the build is complete
                Future.delayed(Duration.zero, () {
                  _register(context);
                });
              },
              child: Text('Register'),
            ),

          ],
        ),
      ),
    );
  }
}
