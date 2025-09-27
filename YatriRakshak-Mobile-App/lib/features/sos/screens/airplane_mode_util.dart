import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'airplane_mode_warning.dart';

class AirplaneModeUtil {
  static const MethodChannel _channel = MethodChannel("sos_channel");

  /// **Check if Airplane Mode is ON**
  static Future<void> checkAndShowWarning(BuildContext context) async {
    try {
      final bool isOn = await _channel.invokeMethod("isAirplaneModeOn");
      if (isOn) {
        _showWarning(context);
      }
    } on PlatformException catch (e) {
      print("❌ Error checking Airplane Mode: ${e.message}");
    }
  }

  /// **Show Airplane Mode Alert**
  static void _showWarning(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      showDialog(
        context: context,
        barrierDismissible: false, // Prevent closing without action
        builder: (context) => AirplaneModeWarning(),
      );
    });
  }
}