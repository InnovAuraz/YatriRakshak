import 'package:flutter/material.dart';

import 'package:yatri_rakshak/core/widgets/bottom_nav.dart';
import 'package:yatri_rakshak/core/widgets/custom_button.dart';
import 'package:yatri_rakshak/features/community/screens/reviews_screen.dart';
import 'package:yatri_rakshak/features/community/screens/volunteers_screen.dart';

import '../../../core/constrants/app_strings.dart';

class CommunityScreen extends StatelessWidget {
  const CommunityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text(AppStrings.communityTitle),
          bottom: const TabBar(
            tabs: [
              Tab(text: AppStrings.reviews),
              Tab(text: AppStrings.volunteers),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            ReviewsScreen(),
            VolunteersScreen(),
          ],
        ),
        floatingActionButton: CustomButton(
          text: AppStrings.writeReview,
          onPressed: () {
            // Dummy action for writing a review
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Write Review feature coming soon!')),
            );
          },
        ),
        bottomNavigationBar: const AppBottomNav(currentIndex: 2),
      ),
    );
  }
}