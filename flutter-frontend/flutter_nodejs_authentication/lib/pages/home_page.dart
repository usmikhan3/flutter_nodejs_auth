import 'package:flutter/material.dart';
import 'package:flutter_nodejs_authentication/services/api_services.dart';
import 'package:flutter_nodejs_authentication/services/shared_service.dart';

class Homepage extends StatefulWidget {
  const Homepage({Key? key}) : super(key: key);

  @override
  _HomepageState createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      appBar: AppBar(
        title: Text("FLUTER NODEJS AUTH"),
        elevation: 0.0,
        actions: [
          IconButton(
            onPressed: () {
              SharedService.logout(context);
            },
            icon: Icon(Icons.logout),
            color: Colors.black,
          )
        ],
      ),
      body: userProfile(),
    );
  }

  Widget userProfile() {
    return FutureBuilder(
      future: APIServices.getUserProfile(),
      builder: (BuildContext context, AsyncSnapshot<String> model) {
        if (model.hasData) {
          return Center(
            child: Text(model.data!),
          );
        }

        return const Center(
          child: CircularProgressIndicator(),
        );
      },
    );
  }
}
