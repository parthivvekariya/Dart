

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'Login.dart';
import 'Registration.dart';
import 'db.dart';

class Deshbord extends StatefulWidget {
  @override
  DeshbordState createState() => DeshbordState();
}

class DeshbordState extends State<Deshbord> {
  List<Map>? slist; // Make slist nullable
  MyDb mydb = MyDb();
  TextEditingController searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    mydb.open().then((_) {
      getData();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Users"),
      actions: [
        IconButton(onPressed: _logout, icon: Icon(Icons.logout_rounded))
        ],),
      body: Column(
        children: [
          SearchBar(
            controller:searchController ,
            //searchController: searchController,
            onChanged: filterTasks,
            leading: Icon(Icons.search),
          ),
          Expanded(
            child: slist == null
                ? Center(child: CircularProgressIndicator())
                : slist!.isEmpty
                ? Center(child: Text("No User to show."))
                : ListView.builder(
              itemCount: slist!.length,
              itemBuilder: (BuildContext context, int index) {
                final stuone = slist![index];


                return Card(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  margin: EdgeInsets.all(10),
                  child: Column(
                    children: [
                      ListTile(
                        leading: Icon(Icons.person, color: Colors.black),
                        title: Text(
                          "User: ${stuone["username"] ?? "N/A"}",
                          style: TextStyle(
                            fontSize: 18,
                          ),
                        ),
                        subtitle: Column(
                          children: [
                            Text(
                              "number: ${stuone["number"] ?? "N/A"}",
                              style: TextStyle(
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 5,),
                            Text(
                              "email: ${stuone["email"] ?? "N/A"}",
                              style: TextStyle(
                                fontSize: 16,
                              ),
                            ),
                          ],
                        )
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => Registration()),
          );
        },
        child: Icon(Icons.add),
      ),

    );
  }

  Future<void> getData() async {
    slist = await mydb.db.rawQuery('SELECT * FROM User');
    setState(() {});
  }

  void filterTasks(String query) {
    if (query.isEmpty) {
      getData(); // If the search query is empty, show all tasks
    } else {
      List<Map> filteredList = slist!
          .where((task) =>
      task["username"]!.toLowerCase().contains(query.toLowerCase()) ||
          task["number"]!.toLowerCase().contains(query.toLowerCase()))
          .toList();
      setState(() {
        slist = filteredList;
      });
    }
  }

  Future<void> _logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('isLoggedIn');

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => LoginScreen()),
    );
  }
}




