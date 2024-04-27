import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'api_service.dart';
import 'app_colors.dart';
import 'main.dart';
import 'package:animated_text_kit/animated_text_kit.dart';

class FaceSearchScreen extends StatefulWidget {
  @override
  _FaceSearchScreenState createState() => _FaceSearchScreenState();
}

class _FaceSearchScreenState extends State
{
  final StreamController<String> _imageStreamController = StreamController<String>();
  final ApiService _apiService = ApiService();

  late List<String> _images = [];

  @override
  void initState() {
    super.initState();
    _startFetchingImages();
  }

  @override
  void dispose() {
    _imageStreamController.close();
    super.dispose();
  }

  void _startFetchingImages() {
    ApiService.fetchImages().listen((image) {
      setState(() {
        _images.add(image);
        _imageStreamController.add(image);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: 50),
            AnimatedTextKit(
              animatedTexts: [
                TypewriterAnimatedText(
                  'Your Results',
                  textStyle: GoogleFonts.orbitron(
                    textStyle: TextStyle(fontSize: 25, color: AppColors.color1),
                  ),
                  speed: Duration(milliseconds: 200), // Typing speed
                  cursor: '|', // Cursor character
                ),
              ],
            ),
            SizedBox(height: 30),
            Expanded(
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 5,
                  mainAxisSpacing: 10.0,
                  crossAxisSpacing: 10.0,
                ),
                itemCount: _images.length,
                itemBuilder: (context, index) {
                  return AnimatedContainer(
                    duration: Duration(milliseconds: 500),
                    curve: Curves.easeInOut,
                    decoration: BoxDecoration(
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.5),
                          spreadRadius: 2,
                          blurRadius: 5,
                          offset: Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Image.network(
                      _images[index],
                      fit: BoxFit.cover,
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => UploadScreen()),
          );
        },
        child: Icon(Icons.home),
        backgroundColor: AppColors.color1,
      ),
    );
  }
}