

import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';



class MyDb {
  late Database db;

  Future open() async {
    var databasesPath = await getDatabasesPath();
    String path = join(databasesPath, 'User.db');
    print(path);
    db = await openDatabase(path, version: 1, onCreate: (Database db, int version) async {
      await db.execute('''
        CREATE TABLE IF NOT EXISTS User(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR(255) NOT NULL,
          number VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      ''');
      print("Table Created");
    });
  }

  Future<Map<dynamic, dynamic>?> getUser(int id) async {
    List<Map> maps = await db.query('User', where: 'id = ?', whereArgs: [id]);
    if (maps.length > 0) {
      return maps.first;
    }
    return null;
  }

  Future<bool> login( username,  password) async {
    List<Map> maps = await db.query('User', where: 'username = ? AND password = ?', whereArgs: [username, password]);
    return maps.isNotEmpty; // Returns true if a user with the given credentials exists
  }
}

// class MyDb
// {
//
//   late Database db;
//
//   Future open() async
//   {
//
//     var databasesPath = await getDatabasesPath();
//     String path = join(databasesPath, 'User.db');
//     print(path);
//     db = await openDatabase(path, version: 1, onCreate: (Database db, int version) async {
//       await db.execute('''
//     CREATE TABLE IF NOT EXISTS User(
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       username VARCHAR(255) NOT NULL,
//       number VARCHAR(255) NOT NULL,
//       email VARCHAR(255) NOT NULL,
//       password VARCHAR(255) NOT NULL
//     )
//   ''');
//       print("Table Created");
//     });
//
//
//   }
//
//   Future<Map<dynamic, dynamic>?> getUser(int id) async {
//     List<Map> maps = await db.query('User',
//         where: 'id = ?',
//         whereArgs: [id]);
//     //getting student data with roll no.
//     if (maps.length > 0) {
//       return maps.first;
//     }
//     return null;
//   }
//
// }
