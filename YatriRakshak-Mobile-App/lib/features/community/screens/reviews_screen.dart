import 'package:flutter/material.dart';
import 'package:yatri_rakshak/core/utils/dummy_data.dart';

import '../../../core/constrants/app_sizes.dart';
import '../widgets/review_card.dart';

class ReviewsScreen extends StatelessWidget {
  const ReviewsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(AppSizes.p16),
      itemCount: DummyData.dummyReviews.length,
      separatorBuilder: (context, index) => const SizedBox(height: AppSizes.p12),
      itemBuilder: (context, index) {
        final review = DummyData.dummyReviews[index];
        return ReviewCard(
          name: review['name']!,
          review: review['review']!,
          rating: review['rating']!.toDouble(),
        );
      },
    );
  }
}