import 'dart:async';

class ApiService {
  static final List<String> dummyImages = [
    'https://roasting-conflict.000webhostapp.com/faces/anil.jpg',
    'https://roasting-conflict.000webhostapp.com/faces/%E2%80%8BRana%20Daggubati%20.jpg',
    'https://roasting-conflict.000webhostapp.com/faces/%E2%80%8BRana%20Daggubati.jpg',

    'https://roasting-conflict.000webhostapp.com/faces/salmanbhai.jpg',

    'https://roasting-conflict.000webhostapp.com/faces/salmanbhai3.jpg',

    'https://roasting-conflict.000webhostapp.com/faces/Shahrukh_Khan.webp',
    'https://roasting-conflict.000webhostapp.com/faces/srk1.jpg',
    'https://roasting-conflict.000webhostapp.com/faces/srk2.jpg',
    'https://roasting-conflict.000webhostapp.com/faces/srk3.jpg',
    'https://roasting-conflict.000webhostapp.com/faces/sunil.jpg',
  ];

  static Stream<String> fetchImages() {
    return Stream.periodic(Duration(seconds: 2), (index) {
      return dummyImages[index % dummyImages.length];
    });
  }
}
