
import 'dart:io';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lottie/lottie.dart';
import 'dart:async';
import 'package:animated_text_kit/animated_text_kit.dart';

import 'FaceSearchScreen.dart';
import 'app_colors.dart'; // Add this line for working with Futures and delayed navigation


void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: UploadScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class UploadScreen extends StatefulWidget {
  @override
  _UploadScreenState createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  File? _image;
  final picker = ImagePicker();

  Future getImage() async {
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    setState(() {
      if (pickedFile != null) {
        _image = File(pickedFile.path);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.black,
            content: Text('Image Selected'),
          ),
        );

        // Delayed navigation after 4 seconds
        Future.delayed(Duration(seconds: 8), () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => FaceSearchScreen()),
          );
        });
      } else {
        print('No image selected.');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Can Not select'),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: getImage,
      child: Scaffold(
        backgroundColor: AppColors.color2,
        body: Stack(
          fit: StackFit.expand, // Ensure the Stack fills the entire screen
          children: [
            Positioned.fill(
              child: Center(
                child: Lottie.network(
                  "https://roasting-conflict.000webhostapp.com/lotti/face%20search%20loding.json",
                  width: MediaQuery.of(context).size.width * 0.6, // Set width to half of the screen width
                  height: MediaQuery.of(context).size.height * 0.6, // Set height to half of the screen height
                  repeat: true,
                  reverse: true,
                  animate: true,
                ),
              ),
            ),
            Positioned.fill(
              bottom: 20, // Adjust the bottom margin as needed
              child: Center(
                child: Container(
                  height: 100,
                  width: 170,
                  alignment: Alignment.center,
                  child: _image == null
                      ? GestureDetector(
                          onTap: getImage,
                          child: AnimatedTextKit(
                            animatedTexts: [
                              TypewriterAnimatedText(
                                'Select image..',
                                textStyle: GoogleFonts.orbitron(
                                  textStyle: TextStyle(fontSize: 20, color: AppColors.color1),
                                ),
                                speed: Duration(milliseconds: 100), // Typing speed
                              ),
                            ],
                          ),
                        )
                      : Center(
                          child: Lottie.network(
                            "https://roasting-conflict.000webhostapp.com/lotti/searching.json",
                            width: MediaQuery.of(context).size.width * 0.8, // Set width to half of the screen width
                            height: MediaQuery.of(context).size.height * 0.8, // Set height to half of the screen height
                            repeat: true,
                            reverse: true,
                            animate: true,
                          ),
                  )
                  //Image.file(_image!),
                ),
              ),
            ),
            Positioned(
              bottom: 100, // Adjust the bottom margin as needed
              left: 0,
              right: 0,
              child: Center(
                child:AnimatedTextKit(
                  animatedTexts: [
                    TypewriterAnimatedText(
                      'HI Thair Assign Image To  Manglu To Finde Image.. ',
                      textStyle: GoogleFonts.orbitron(
                        textStyle: TextStyle(fontSize: 25, color: AppColors.color1),
                      ),
                      speed: Duration(milliseconds: 200), // Typing speed
                      cursor: '|', // Cursor character
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
