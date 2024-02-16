import 'dart:io';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:image_upload/view.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: UploadScreen(),
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
            content: Text('Image Selected'),
          ),
        );
      } else {
        print('No image selected.');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Can Not select)'),
          ),
        );
      }
    });
  }

  Future uploadImage() async {
    if (_image == null) {
      return; // No image selected
    }

    // Replace 'YOUR_PHP_SCRIPT_URL' with the actual URL of your PHP script
    var url = Uri.parse('https://roasting-conflict.000webhostapp.com/API/uploadimages/uploadimage.php');

    var request = http.MultipartRequest('POST', url);
    request.fields['data'] = 'your_data_here'; // Replace with your category data

    var pic = await http.MultipartFile.fromPath('profile_pic', _image!.path);
    request.files.add(pic);

    var response = await request.send();
    if (response.statusCode == 200) {
      print('Image uploaded successfully');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Image uploaded successfully'),
        ),
      );
    } else {
      print('Image upload failed');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Image upload failed'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Upload Image'),
        actions: [
          IconButton(onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => view()),
            );
          }, icon: Icon(CupertinoIcons.eye))
        ],
      ),
      body: Center(
        child: _image == null
            ? Text('No image selected.')
            : Image.file(_image!),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: <Widget>[
          FloatingActionButton(
            onPressed: getImage,
            tooltip: 'Select Image',
            child: Icon(Icons.photo_library),
          ),
          SizedBox(height: 10),
          FloatingActionButton(
            onPressed: uploadImage,
            tooltip: 'Upload Image',
            child: Icon(Icons.cloud_upload),
          ),
        ],
      ),
    );
  }
}
