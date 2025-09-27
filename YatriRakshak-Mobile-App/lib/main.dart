import 'dart:async';
import 'package:flutter/material.dart';
import 'package:yatri_rakshak/app.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  // Wrap everything in error handling
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();
    
    try {
      // Initialize Firebase
      await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform,
      );
      print('✅ Firebase initialized successfully');
    } catch (e) {
      print('❌ Firebase initialization failed: $e');
      // Continue app startup even if Firebase fails
    }
    
    runApp(const YatriRakshakApp());
  }, (error, stackTrace) {
    print('❌ Critical app error: $error');
    print('Stack trace: $stackTrace');
  });
}