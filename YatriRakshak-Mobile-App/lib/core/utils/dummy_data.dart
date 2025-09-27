import 'package:google_maps_flutter/google_maps_flutter.dart';

class DummyData {
  static final List<Map<String, dynamic>> dummyReviews = [
    {
      'name': 'Priya Sharma',
      'review': 'The volunteers were incredibly helpful and responsive. I felt safe throughout my trip.',
      'rating': 5,
    },
    {
      'name': 'Rajesh Kumar',
      'review': 'A great initiative. The app is easy to use and provides peace of mind.',
      'rating': 4,
    },
    {
      'name': 'Ananya Singh',
      'review': 'This app is a must-have for solo travelers. The community feature is very useful.',
      'rating': 5,
    },
    {
      'name': 'David Miller',
      'review': 'I faced an issue, and a local volunteer was there to help in minutes. Thank you!',
      'rating': 5,
    },
  ];

  static final List<Map<String, dynamic>> dummyVolunteers = [
    {
      'name': 'Amit Patel',
      'city': 'New Delhi',
      'badge': 'Certified',
    },
    {
      'name': 'Sarah Jones',
      'city': 'Mumbai',
      'badge': 'Experienced',
    },
    {
      'name': 'Chen Li',
      'city': 'Kolkata',
      'badge': 'Trained',
    },
  ];

  static final List<Map<String, dynamic>> dummyAlerts = [
    {
      'title': 'Lost and Found Alert',
      'description': 'A user reported a lost wallet near Connaught Place.',
    },
    {
      'title': 'Crowd Congestion Warning',
      'description': 'High crowd density reported at a local market. Please be cautious.',
    },
    {
      'title': 'Medical Assistance Required',
      'description': 'A user has requested medical help at a nearby location.',
    },
  ];

  static final List<Marker> dummyMarkers = [
    const Marker(
      markerId: MarkerId('marker_1'),
      position: LatLng(28.6139, 77.2090), // New Delhi
      infoWindow: InfoWindow(title: 'Emergency: Medical Help'),
    ),
    const Marker(
      markerId: MarkerId('marker_2'),
      position: LatLng(19.0760, 72.8777), // Mumbai
      infoWindow: InfoWindow(title: 'Safety Zone'),
    ),
    const Marker(
      markerId: MarkerId('marker_3'),
      position: LatLng(22.5726, 88.3639), // Kolkata
      infoWindow: InfoWindow(title: 'Volunteer Point'),
    ),
  ];
}