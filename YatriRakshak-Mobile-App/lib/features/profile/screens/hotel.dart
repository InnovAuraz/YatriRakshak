import 'package:flutter/material.dart';
import '../../../core/widgets/bottom_nav.dart';

class HotelsScreen extends StatelessWidget {
  const HotelsScreen({super.key});

  final List<Map<String, dynamic>> hotelData = const [
    {
      'name': 'Elite Business Hotel',
      'rating': 4.8,
      'reviews': 312,
      'distance': '0.5 km',
      'safetyScore': '9.5/10',
      'tags': ['Women-Safe', 'Fire Exits +2', 'Premium Cleanliness', 'Exceptional Staff'],
    },
    {
      'name': 'The Grand Plaza Hotel',
      'rating': 4.6,
      'reviews': 247,
      'distance': '0.8 km',
      'safetyScore': '9.2/10',
      'tags': ['Women-Safe', 'Fire Exits +1', 'Excellent Cleanliness', 'Professional Staff'],
    },
    {
      'name': 'SafeStay Inn & Suites',
      'rating': 4.3,
      'reviews': 189,
      'distance': '1.2 km',
      'safetyScore': '8.8/10',
      'tags': ['Budget Friendly', 'Profile', 'Profile'],
    },
    {
      'name': 'City Comfort Suites',
      'rating': 4.2,
      'reviews': 154,
      'distance': '1.5 km',
      'safetyScore': '8.5/10',
      'tags': ['Women-Safe', 'Fire Exits +1', 'Comfortable Rooms', 'Friendly Staff'],
    },
    {
      'name': 'Urban Stay Hotel',
      'rating': 4.0,
      'reviews': 98,
      'distance': '2.0 km',
      'safetyScore': '8.0/10',
      'tags': ['Budget Friendly', 'Cleanliness Good', '24/7 Reception'],
    },
    {
      'name': 'Luxury Palace Hotel',
      'rating': 4.9,
      'reviews': 412,
      'distance': '0.9 km',
      'safetyScore': '9.7/10',
      'tags': ['Women-Safe', 'Premium Cleanliness', 'Top Staff', 'Spa & Pool'],
    },
    {
      'name': 'Sunrise Residency',
      'rating': 4.1,
      'reviews': 120,
      'distance': '2.3 km',
      'safetyScore': '8.3/10',
      'tags': ['Clean Rooms', 'Safe Location', 'Friendly Staff'],
    },
    {
      'name': 'Mountain View Hotel',
      'rating': 4.5,
      'reviews': 210,
      'distance': '3.0 km',
      'safetyScore': '9.0/10',
      'tags': ['Scenic View', 'Premium Cleanliness', 'Women-Safe'],
    },
    {
      'name': 'Riverside Retreat',
      'rating': 4.3,
      'reviews': 178,
      'distance': '2.8 km',
      'safetyScore': '8.7/10',
      'tags': ['Waterfront', 'Quiet Area', 'Friendly Staff'],
    },
    {
      'name': 'Heritage Inn',
      'rating': 4.4,
      'reviews': 205,
      'distance': '1.7 km',
      'safetyScore': '8.9/10',
      'tags': ['Historic Building', 'Comfortable Rooms', 'Women-Safe'],
    },
  ];

  @override
  Widget build(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final screenWidth = mediaQuery.size.width;
    final screenHeight = mediaQuery.size.height;

    double fs(double size) => size * screenWidth / 375;
    double sp(double size) => size * screenHeight / 812;

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
          child: SingleChildScrollView(
            padding: EdgeInsets.all(screenWidth * 0.04),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // IconButton(
                    //   onPressed: () => Navigator.pop(context),
                    //   icon: Icon(Icons.arrow_back, color: Colors.white, size: fs(24)),
                    // ),
                    Text(
                      'Hotels',
                      style: TextStyle(
                        fontSize: fs(30),
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(width: screenWidth * 0.12),
                  ],
                ),
                SizedBox(height: sp(16)),

                // Search bar
                Container(
                  padding: EdgeInsets.symmetric(horizontal: screenWidth * 0.04),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Search hotels...',
                      hintStyle: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: fs(14)),
                      border: InputBorder.none,
                      suffixIcon: Icon(Icons.search, color: Colors.white.withOpacity(0.7)),
                    ),
                    style: TextStyle(color: Colors.white, fontSize: fs(14)),
                  ),
                ),
                SizedBox(height: sp(12)),

                // Results count
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${hotelData.length} hotels found',
                      style: TextStyle(
                        fontSize: fs(14),
                        color: Colors.white.withOpacity(0.8),
                      ),
                    ),
                    Text(
                      'Safety Score',
                      style: TextStyle(
                        fontSize: fs(14),
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: sp(24)),

                // Hotel list dynamically
                Column(
                  children: hotelData.map((hotel) {
                    return Padding(
                      padding: EdgeInsets.only(bottom: sp(16)),
                      child: _buildHotelCard(
                        context,
                        name: hotel['name'],
                        rating: hotel['rating'],
                        reviews: hotel['reviews'],
                        distance: hotel['distance'],
                        safetyScore: hotel['safetyScore'],
                        tags: List<String>.from(hotel['tags']),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: const AppBottomNav(currentIndex: 2),
    );
  }

  Widget _buildHotelCard(
      BuildContext context, {
        required String name,
        required double rating,
        required int reviews,
        required String distance,
        required String safetyScore,
        required List<String> tags,
      }) {
    final mediaQuery = MediaQuery.of(context);
    final screenWidth = mediaQuery.size.width;
    final screenHeight = mediaQuery.size.height;
    double fs(double size) => size * screenWidth / 375;
    double sp(double size) => size * screenHeight / 812;

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(screenWidth * 0.04),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hotel name
          Text(
            name,
            style: TextStyle(fontSize: fs(18), fontWeight: FontWeight.bold, color: Colors.white),
          ),
          SizedBox(height: sp(12)),

          // Rating
          Row(
            children: [
              Icon(Icons.star, color: Colors.amber, size: fs(16)),
              SizedBox(width: screenWidth * 0.01),
              Text('$rating ($reviews)', style: TextStyle(fontSize: fs(14), color: Colors.white)),
            ],
          ),
          SizedBox(height: sp(8)),

          // Distance
          Row(
            children: [
              Icon(Icons.location_on, color: Colors.white, size: fs(16)),
              SizedBox(width: screenWidth * 0.01),
              Text(distance, style: TextStyle(fontSize: fs(14), color: Colors.white)),
            ],
          ),
          SizedBox(height: sp(8)),

          // Safety Score
          Row(
            children: [
              Icon(Icons.security, color: Colors.green.shade300, size: fs(16)),
              SizedBox(width: screenWidth * 0.01),
              Text('Safety Score: ', style: TextStyle(fontSize: fs(14), color: Colors.white)),
              Text(
                safetyScore,
                style: TextStyle(fontSize: fs(14), fontWeight: FontWeight.bold, color: Colors.green.shade300),
              ),
            ],
          ),
          SizedBox(height: sp(12)),

          // Tags
          Wrap(
            spacing: screenWidth * 0.02,
            runSpacing: screenHeight * 0.01,
            children: tags.map((tag) {
              return Container(
                padding: EdgeInsets.symmetric(horizontal: screenWidth * 0.03, vertical: screenHeight * 0.008),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(tag, style: TextStyle(fontSize: fs(12), color: Colors.white)),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}
