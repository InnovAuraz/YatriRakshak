import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AirplaneModeWarning extends StatelessWidget {
  static const platform = MethodChannel('sos_channel');

  void _openSettings(BuildContext context) async {
    try {
      await platform.invokeMethod('openAirplaneModeSettings');
    } on PlatformException catch (e) {
      print("❌ Error: ${e.message}");
    }
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text("Airplane Mode is ON"),
      content: Text("Please disable Airplane Mode to use all features."),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text("Cancel"),
        ),
        TextButton(
          onPressed: () => _openSettings(context),
          child: Text("Disable", style: TextStyle(color: Colors.red)),
        ),
      ],
    );
  }
}