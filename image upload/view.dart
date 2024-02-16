//https://roasting-conflict.000webhostapp.com/API/uploadimages/view.php\


import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class view extends StatefulWidget {
  @override
  viewState createState() => viewState();
}

class viewState extends State<view> {
  List<Map<String, dynamic>> _imagesData = [];

  @override
  void initState() {
    super.initState();
    fetchImageData();
  }

  Future<void> fetchImageData() async {
    final url = Uri.parse('https://roasting-conflict.000webhostapp.com/API/uploadimages/view.php');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      setState(() {
        _imagesData = List<Map<String, dynamic>>.from(jsonDecode(response.body));
      });
    } else {
      throw Exception('Failed to load image data');
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Image Viewer'),
        ),
        body: ListView.builder(
          itemCount: _imagesData.length,
          itemBuilder: (context, index) {
            final imageData = _imagesData[index];
            final iName = imageData['i_name'];
            final imageUrl = imageData['image'];

            return ListTile(
              title: Text(iName),
              leading: Image.network(imageUrl,height: 200 ,width: 200,),
            );
          },
        ),
      ),
    );
  }
}
