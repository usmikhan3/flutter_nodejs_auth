import 'package:flutter/material.dart';
import 'package:flutter_nodejs_authentication/pages/home_page.dart';
import 'package:flutter_nodejs_authentication/pages/login_page.dart';
import 'package:flutter_nodejs_authentication/pages/register_page.dart';
import 'package:flutter_nodejs_authentication/services/shared_service.dart';

Widget _defaultHome = const LoginPage();
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  bool _result = await SharedService.isLoggedIn();
  if (_result) {
    _defaultHome = const Homepage();
  }
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      routes: {
        '/': (context) => _defaultHome,
        '/home': (context) => const Homepage(),
        '/login': (context) => const LoginPage(),
        '/register': (context) => const RegisterPage(),
      },
    );
  }
}
