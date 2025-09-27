import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:yatri_rakshak/features/auth/screens/login_screen.dart';
import 'package:yatri_rakshak/features/auth/screens/signup_screen.dart';
import 'package:yatri_rakshak/features/dashboard/screens/dashboard_screen.dart';
import 'package:yatri_rakshak/features/map/screens/map_screen.dart';
import 'package:yatri_rakshak/features/profile/screens/hotel.dart';
import 'package:yatri_rakshak/features/profile/screens/profile_screen.dart';
import 'package:yatri_rakshak/features/settings/screens/settings_screen.dart';
import 'package:yatri_rakshak/features/sos/screens/sos_screen.dart';
import 'package:yatri_rakshak/features/splash/screens/onboarding_screen.dart';
import 'package:yatri_rakshak/features/splash/screens/splash_screen.dart';

import '../features/community/screens/community_screen.dart';
import '../features/profile/screens/digital_it.dart';
import '../features/sos/screens/sos_alert_page.dart';

final _auth = FirebaseAuth.instance;

class AppRoutes {
  static final GoRouter router = GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/signup',
        builder: (context, state) => const SignupScreen(),
      ),
      // This ShellRoute is perfect for screens that share a common UI,
      // like a bottom navigation bar.
      // For now, it simply displays the child.
      ShellRoute(
        builder: (context, state, child) {
          return child;
        },
        routes: [
          GoRoute(
            path: '/dashboard',
            builder: (context, state) => const DashboardScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/map',
            builder: (context, state) => const MapScreen(),
          ),
          GoRoute(
            path: '/community',
            builder: (context, state) => const CommunityScreen(),
          ),
          GoRoute(
            path: '/identity-info',
            builder: (context, state) => const DigitalTravelIdScreen(),
          ),
          GoRoute(
            path: '/hotels',
            builder: (context, state) => const HotelsScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/sos',
        builder: (context, state) => const SosScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/sos-alert',
        builder: (context, state) => SosAlertPage(),
      ),
    ],
    redirect: (BuildContext context, GoRouterState state) {
      // Check if the user is logged in
      final loggedIn = _auth.currentUser != null;
      final loggingIn = state.uri.path == '/login' || state.uri.path == '/signup';
      final inAuthFlow = loggingIn || 
                        state.uri.path == '/onboarding' || 
                        state.uri.path == '/splash';
      final isSOSAlert = state.uri.path == '/sos-alert';

      // Allow SOS alert page regardless of auth status (emergency feature)
      if (isSOSAlert) {
        return null;
      }

      // If we're on splash, let it handle the navigation
      if (state.uri.path == '/splash') {
        return null;
      }

      // If not logged in and not in the auth flow, go to splash first
      if (!loggedIn && !inAuthFlow) {
        return '/splash';
      }

      // If logged in and trying to access auth flow (except splash), go to dashboard
      if (loggedIn && (loggingIn || state.uri.path == '/onboarding')) {
        return '/dashboard';
      }

      // No redirect needed
      return null;
    },
    // This listener makes the router rebuild whenever auth state changes.
    refreshListenable: GoRouterRefreshStream(_auth.authStateChanges()),
  );
}

class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    notifyListeners();
    _subscription = stream.asBroadcastStream().listen(
          (dynamic _) => notifyListeners(),
    );
  }

  late final StreamSubscription _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}
