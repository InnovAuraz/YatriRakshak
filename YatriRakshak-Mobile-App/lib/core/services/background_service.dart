import 'dart:async';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:flutter_background_service_android/flutter_background_service_android.dart';
import 'package:geolocator/geolocator.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'dart:math';

class BackgroundService {
  static Future<void> initializeService() async {
    final service = FlutterBackgroundService();

    await service.configure(
      iosConfiguration: IosConfiguration(
        autoStart: true,
        onForeground: onStart,
        onBackground: onIosBackground,
      ),
      androidConfiguration: AndroidConfiguration(
        onStart: onStart,
        autoStart: true,
        isForegroundMode: true,
        autoStartOnBoot: true,
        notificationChannelId: 'yatri_rakshak_bg',
        initialNotificationTitle: 'Yatri Rakshak Protection',
        initialNotificationContent: 'Monitoring your safety in the background',
        foregroundServiceNotificationId: 888,
      ),
    );
  }

  @pragma('vm:entry-point')
  static Future<bool> onIosBackground(ServiceInstance service) async {
    WidgetsFlutterBinding.ensureInitialized();
    DartPluginRegistrant.ensureInitialized();
    return true;
  }

  @pragma('vm:entry-point')
  static void onStart(ServiceInstance service) async {
    DartPluginRegistrant.ensureInitialized();
    
    // Initialize variables for monitoring
    Position? lastPosition;
    DateTime? lastLocationUpdate;
    bool isMonitoringEnabled = true;
    StreamSubscription<AccelerometerEvent>? accelerometerSubscription;

    if (service is AndroidServiceInstance) {
      service.on('setAsForeground').listen((event) {
        service.setAsForegroundService();
      });

      service.on('setAsBackground').listen((event) {
        service.setAsBackgroundService();
      });
    }

    service.on('stopService').listen((event) {
      accelerometerSubscription?.cancel();
      service.stopSelf();
    });

    // Location monitoring
    Timer.periodic(const Duration(minutes: 5), (timer) async {
      if (!isMonitoringEnabled) return;

      try {
        final position = await Geolocator.getCurrentPosition();
        
        // Check for unusual location changes (potential danger)
        if (lastPosition != null) {
          final distance = Geolocator.distanceBetween(
            lastPosition!.latitude,
            lastPosition!.longitude,
            position.latitude,
            position.longitude,
          );
          
          // If moved more than 5km in 5 minutes, could indicate danger
          if (distance > 5000) {
            await _sendLocationAlert(position, 'Unusual movement detected');
          }
        }

        lastPosition = position;
        lastLocationUpdate = DateTime.now();

        // Update notification with current location info
        if (service is AndroidServiceInstance) {
          await service.setForegroundNotificationInfo(
            title: "Yatri Rakshak Protection Active",
            content: "Last location: ${position.latitude.toStringAsFixed(4)}, ${position.longitude.toStringAsFixed(4)}",
          );
        }
      } catch (e) {
        print('Background location error: $e');
      }
    });

    // Fall detection monitoring
    accelerometerSubscription = accelerometerEvents.listen((event) {
      double acceleration = sqrt(event.x * event.x + event.y * event.y + event.z * event.z);
      
      // Detect sudden drops or impacts (potential accidents)
      if (acceleration < 2.0 || acceleration > 25.0) {
        _handlePotentialEmergency('Fall or impact detected');
      }
    });

    // Periodic safety check-in
    Timer.periodic(const Duration(hours: 1), (timer) async {
      try {
        await _performSafetyCheckin();
      } catch (e) {
        print('Safety check-in error: $e');
      }
    });
  }

  static Future<void> _sendLocationAlert(Position position, String reason) async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .collection('alerts')
            .add({
          'type': 'location_alert',
          'reason': reason,
          'latitude': position.latitude,
          'longitude': position.longitude,
          'timestamp': FieldValue.serverTimestamp(),
          'accuracy': position.accuracy,
        });
      }
    } catch (e) {
      print('Error sending location alert: $e');
    }
  }

  static Future<void> _handlePotentialEmergency(String reason) async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        final position = await Geolocator.getCurrentPosition();
        
        await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .collection('emergency_alerts')
            .add({
          'type': 'potential_emergency',
          'reason': reason,
          'latitude': position.latitude,
          'longitude': position.longitude,
          'timestamp': FieldValue.serverTimestamp(),
          'auto_detected': true,
        });
      }
    } catch (e) {
      print('Error handling potential emergency: $e');
    }
  }

  static Future<void> _performSafetyCheckin() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        final position = await Geolocator.getCurrentPosition();
        
        await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .collection('safety_checkins')
            .add({
          'latitude': position.latitude,
          'longitude': position.longitude,
          'timestamp': FieldValue.serverTimestamp(),
          'battery_level': await _getBatteryLevel(),
        });
      }
    } catch (e) {
      print('Error performing safety check-in: $e');
    }
  }

  static Future<int> _getBatteryLevel() async {
    // You can implement battery level checking here
    // For now, return a placeholder
    return 100;
  }

  // Start the background service
  static Future<void> startService() async {
    final service = FlutterBackgroundService();
    var isRunning = await service.isRunning();
    if (!isRunning) {
      service.startService();
    }
  }

  // Stop the background service
  static Future<void> stopService() async {
    final service = FlutterBackgroundService();
    service.invoke("stopService");
  }

  // Check if service is running
  static Future<bool> isServiceRunning() async {
    final service = FlutterBackgroundService();
    return await service.isRunning();
  }
}