import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:yatri_rakshak/core/theme/text_styles.dart';
import 'package:yatri_rakshak/core/utils/responsive_helper.dart';
import '../../../core/constrants/app_strings.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  String _statusText = 'Initializing...';
  List<String> _grantedPermissions = [];
  List<String> _deniedPermissions = [];

  @override
  void initState() {
    super.initState();
    _initSplash();
  }

  Future<void> _initSplash() async {
    try {
      // Show splash for at least 1 second
      setState(() => _statusText = 'Loading...');
      await Future.delayed(const Duration(seconds: 1));

      // Request all necessary permissions
      setState(() => _statusText = 'Setting up permissions...');
      await _requestAllPermissions();

      // Wait for Firebase Auth to initialize properly
      setState(() => _statusText = 'Checking account status...');
      await _waitForFirebaseAuth();

      // Add a small delay for better UX
      await Future.delayed(const Duration(seconds: 1));

      // Navigate based on authentication status
      setState(() => _statusText = 'Almost ready...');
      _navigateBasedOnAuth();
    } catch (e) {
      print('❌ Error during splash initialization: $e');
      setState(() => _statusText = 'Starting app...');
      
      // Wait a bit and try direct navigation to login
      await Future.delayed(const Duration(seconds: 1));
      
      try {
        if (mounted) {
          context.go('/login');
        }
      } catch (navError) {
        print('❌ Critical error: Cannot navigate from splash: $navError');
      }
    }
  }

  Future<void> _waitForFirebaseAuth() async {
    try {
      // Wait for auth state to be ready
      final completer = Completer<void>();
      late StreamSubscription subscription;

      subscription = FirebaseAuth.instance.authStateChanges().listen((user) {
        // Auth state is ready, complete the future
        if (!completer.isCompleted) {
          completer.complete();
        }
        subscription.cancel();
      });

      // Wait for auth state or timeout after 3 seconds
      await completer.future.timeout(
        const Duration(seconds: 3),
        onTimeout: () {
          print("⚠️ Firebase Auth timeout, proceeding anyway");
        },
      );
    } catch (e) {
      print("❌ Error waiting for Firebase Auth: $e");
    }
  }

  Future<void> _requestAllPermissions() async {
    try {
      // Only request essential permissions first
      final essentialPermissions = [
        Permission.location,
        Permission.locationWhenInUse,
      ];

      setState(() => _statusText = 'Setting up location services...');

      // Request essential permissions together
      final Map<Permission, PermissionStatus> statuses = await essentialPermissions.request();

      // Process results
      for (final entry in statuses.entries) {
        final permission = entry.key;
        final status = entry.value;
        final permissionName = _getPermissionDisplayName(permission);

        if (status.isGranted) {
          _grantedPermissions.add(permissionName);
        } else {
          _deniedPermissions.add(permissionName);
        }
      }

      // Request other permissions in background (non-blocking)
      _requestOptionalPermissions();

      // Set final status message
      setState(() {
        if (_deniedPermissions.isEmpty) {
          _statusText = 'Location services ready!';
        } else {
          _statusText = 'Basic setup complete';
        }
      });

      await Future.delayed(const Duration(milliseconds: 800));

    } catch (e) {
      print('Error requesting permissions: $e');
      setState(() => _statusText = 'Permission setup complete');
    }
  }

  void _requestOptionalPermissions() async {
    // Request other permissions after navigation (non-blocking)
    final optionalPermissions = [
      Permission.phone,
      Permission.sms,
      Permission.camera,
      Permission.notification,
    ];

    // Wait a bit to avoid UI freezing
    await Future.delayed(const Duration(seconds: 2));

    for (final permission in optionalPermissions) {
      try {
        final status = await permission.status;
        if (status.isDenied) {
          await permission.request();
        }
      } catch (e) {
        print('Error requesting ${permission.toString()}: $e');
      }
    }
  }

  String _getPermissionDisplayName(Permission permission) {
    switch (permission) {
      case Permission.location:
      case Permission.locationWhenInUse:
        return 'location';
      case Permission.phone:
        return 'phone';
      case Permission.sms:
        return 'SMS';
      case Permission.camera:
        return 'camera';
      case Permission.notification:
        return 'notification';
      case Permission.storage:
        return 'storage';
      default:
        return 'system';
    }
  }

  Future<bool> _shouldShowRationale(Permission permission) async {
    // You can add custom logic here to determine when to show rationale
    return true;
  }

  Future<void> _showPermissionDialog(Permission permission, String permissionName) async {
    if (!mounted) return;

    String title = 'Permission Required';
    String content = _getPermissionRationale(permission);

    final result = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(_getPermissionIcon(permission), color: Colors.deepPurple),
            const SizedBox(width: 8),
            Text(title),
          ],
        ),
        content: Text(content),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Skip'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Open Settings'),
          ),
        ],
      ),
    );

    if (result == true) {
      await openAppSettings();
    }
  }

  String _getPermissionRationale(Permission permission) {
    switch (permission) {
      case Permission.location:
      case Permission.locationWhenInUse:
        return 'Location access is needed to share your location in emergency situations and help others find you.';
      case Permission.phone:
        return 'Phone access is required to automatically call emergency contacts during SOS alerts.';
      case Permission.sms:
        return 'SMS permission is needed to send emergency messages with your location to your guardians.';
      case Permission.camera:
        return 'Camera access allows you to take photos for incident reporting and profile pictures.';
      case Permission.notification:
        return 'Notifications keep you informed about safety alerts and emergency responses.';
      case Permission.storage:
        return 'Storage access is needed to save photos and manage app data.';
      default:
        return 'This permission helps the app function properly for your safety.';
    }
  }

  IconData _getPermissionIcon(Permission permission) {
    switch (permission) {
      case Permission.location:
      case Permission.locationWhenInUse:
        return Icons.location_on;
      case Permission.phone:
        return Icons.phone;
      case Permission.sms:
        return Icons.sms;
      case Permission.camera:
        return Icons.camera_alt;
      case Permission.notification:
        return Icons.notifications;
      case Permission.storage:
        return Icons.storage;
      default:
        return Icons.security;
    }
  }

  Future<void> _checkCriticalPermissions() async {
    final criticalPermissions = [Permission.location, Permission.phone, Permission.sms];
    final deniedPermissions = <Permission>[];

    for (final permission in criticalPermissions) {
      final status = await permission.status;
      if (status.isDenied || status.isPermanentlyDenied) {
        deniedPermissions.add(permission);
      }
    }

    if (deniedPermissions.isNotEmpty && mounted) {
      await _showCriticalPermissionsDialog(deniedPermissions);
    }
  }

  Future<void> _showCriticalPermissionsDialog(List<Permission> deniedPermissions) async {
    if (!mounted) return;

    final permissionNames = deniedPermissions.map((p) => _getPermissionDisplayName(p)).join(', ');

    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.warning, color: Colors.orange),
            const SizedBox(width: 8),
            const Text('Critical Permissions'),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('The following permissions are essential for emergency features:'),
            const SizedBox(height: 8),
            Text('• $permissionNames', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Without these permissions, SOS and safety features may not work properly.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Continue Anyway'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              openAppSettings();
            },
            child: const Text('Open Settings'),
          ),
        ],
      ),
    );
  }

  void _navigateBasedOnAuth() async {
    if (!mounted) return;

    try {
      // Add a small delay to ensure proper context
      await Future.delayed(const Duration(milliseconds: 500));
      
      if (!mounted) return;

      // Listen for auth state changes to get the most current state
      final user = FirebaseAuth.instance.currentUser;

      if (user != null) {
        // User is logged in
        print("✅ User is logged in: ${user.email ?? 'No email'}");
        print("✅ User UID: ${user.uid}");

        // Optional: Check if user's email is verified
        if (user.emailVerified) {
          print("✅ Email is verified");
        } else {
          print("⚠️ Email is not verified");
        }

        // Navigate to dashboard with error handling
        try {
          if (mounted) {
            context.go('/dashboard');
            print("✅ Navigated to dashboard");
          }
        } catch (navError) {
          print("❌ Error navigating to dashboard: $navError");
          if (mounted) {
            context.go('/login');
          }
        }
      } else {
        // User is not logged in
        print("❌ User is not logged in");

        // Navigate to onboarding with error handling
        try {
          if (mounted) {
            context.go('/onboarding');
            print("✅ Navigated to onboarding");
          }
        } catch (navError) {
          print("❌ Error navigating to onboarding: $navError");
          if (mounted) {
            context.go('/login');
          }
        }
      }
    } catch (e) {
      print("❌ Error checking auth state: $e");
      // On error, go to login as safest fallback
      try {
        if (mounted) {
          context.go('/login');
          print("✅ Navigated to login fallback");
        }
      } catch (fallbackError) {
        print("❌ Critical navigation error: $fallbackError");
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ResponsiveBuilder(
      builder: (context, responsive) {
        return Scaffold(
          body: Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.deepPurple.shade800, Colors.blue.shade400],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: SafeArea(
              child: Padding(
                padding: responsive.padding(horizontal: 20),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // App icon with responsive size
                      Container(
                        padding: EdgeInsets.all(responsive.width(20)),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.tealAccent.withOpacity(0.6),
                              blurRadius: responsive.width(30),
                              spreadRadius: responsive.width(5),
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.shield_outlined,
                          size: responsive.breakpoint(
                            mobile: responsive.width(100),
                            tablet: responsive.width(120),
                            desktop: responsive.width(140),
                          ),
                          color: Colors.tealAccent,
                        ),
                      ),

                      responsive.verticalSpace(24),

                      // App title and tagline
                      Column(
                        children: [
                          Text(
                            AppStrings.appName,
                            style: responsive.headingLarge().copyWith(
                              color: Colors.tealAccent,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.5,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          responsive.verticalSpace(8),
                          Padding(
                            padding: responsive.padding(horizontal: 16),
                            child: Text(
                              AppStrings.splashTagline,
                              style: responsive.bodyLarge().copyWith(
                                color: Colors.white70,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        ],
                      ),

                      responsive.verticalSpace(40),

                      // Loading indicator
                      SizedBox(
                        width: responsive.width(24),
                        height: responsive.width(24),
                        child: const CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          strokeWidth: 2,
                        ),
                      ),

                      responsive.verticalSpace(16),

                      // Status text
                      Container(
                        constraints: BoxConstraints(
                          maxWidth: responsive.breakpoint(
                            mobile: responsive.screenWidth * 0.8,
                            tablet: responsive.screenWidth * 0.6,
                            desktop: responsive.screenWidth * 0.4,
                          ),
                        ),
                        child: Text(
                          _statusText,
                          style: responsive.bodyMedium().copyWith(
                            color: Colors.white70,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),

                      responsive.verticalSpace(20),
                      // Permission status indicators
                      if (_grantedPermissions.isNotEmpty || _deniedPermissions.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.white.withOpacity(0.2)),
                          ),
                          child: Column(
                            children: [
                              if (_grantedPermissions.isNotEmpty) ...[
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.check_circle, color: Colors.green, size: 16),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Granted: ${_grantedPermissions.join(', ')}',
                                      style: TextStyle(
                                        color: Colors.green.shade300,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                                if (_deniedPermissions.isNotEmpty) const SizedBox(height: 8),
                              ],
                              if (_deniedPermissions.isNotEmpty)
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.warning, color: Colors.orange, size: 16),
                                    const SizedBox(width: 8),
                                    Flexible(
                                      child: Text(
                                        'Limited: ${_deniedPermissions.join(', ')}',
                                        style: TextStyle(
                                          color: Colors.orange.shade300,
                                          fontSize: 12,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                    ),
                                  ],
                                ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}