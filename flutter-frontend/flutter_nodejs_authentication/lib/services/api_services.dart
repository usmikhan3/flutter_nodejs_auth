import 'dart:convert';

import 'package:flutter_nodejs_authentication/config.dart';
import 'package:flutter_nodejs_authentication/model/login_request_model.dart';
import 'package:flutter_nodejs_authentication/model/login_response_model.dart';
import 'package:flutter_nodejs_authentication/model/register_response_model.dart';
import 'package:flutter_nodejs_authentication/model/resgister_request_model.dart';
import 'package:flutter_nodejs_authentication/services/shared_service.dart';
import 'package:http/http.dart' as http;

class APIServices {
  static var client = http.Client();

  static Future<bool> login(LoginRequestModel model) async {
    Map<String, String> requestHeaders = {
      'Content-type': 'application/json',
    };

    var url = Uri.http(Config.apiUrl, Config.loginAPI);

    var response = await client.post(
      url,
      headers: requestHeaders,
      body: jsonEncode(
        model.toJson(),
      ),
    );
    if (response.statusCode == 200) {
      //sharedService
      await SharedService.setLoginDetails(loginResponseJson(response.body));
      return true;
    } else {
      return false;
    }
  }

  static Future<RegisterResponseModel> register(
      RegisterRequestModel model) async {
    Map<String, String> requestHeaders = {
      'Content-type': 'application/json',
    };

    var url = Uri.http(Config.apiUrl, Config.registerAPI);

    var response = await client.post(
      url,
      headers: requestHeaders,
      body: jsonEncode(
        model.toJson(),
      ),
    );
    return registerResponseModel(response.body);
  }

  static Future<String> getUserProfile() async {
    var logindetails = await SharedService.loginDetails();
    Map<String, String> requestHeaders = {
      'Content-type': 'application/json',
      'Authorization': 'basic ${logindetails!.data.token}'
    };

    var url = Uri.http(Config.apiUrl, Config.userProfileAPI);

    var response = await client.get(
      url,
      headers: requestHeaders,
    );
    if (response.statusCode == 200) {
      //sharedService
      return response.body;
    } else {
      return '';
    }
  }
}
