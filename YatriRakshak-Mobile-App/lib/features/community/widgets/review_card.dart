import 'package:flutter/material.dart';
import 'package:yatri_rakshak/core/theme/text_styles.dart';
import 'package:yatri_rakshak/core/widgets/custom_card.dart';

import '../../../core/constrants/app_icons.dart';
import '../../../core/constrants/app_sizes.dart';

class ReviewCard extends StatelessWidget {
  final String name;
  final String review;
  final double rating;

  const ReviewCard({
    super.key,
    required this.name,
    required this.review,
    required this.rating,
  });

  @override
  Widget build(BuildContext context) {
    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const CircleAvatar(
                child: Icon(Icons.person),
              ),
              const SizedBox(width: AppSizes.p12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: AppTextStyles.cardTitle),
                    Row(
                      children: List.generate(5, (index) {
                        return Icon(
                          index < rating ? AppIcons.star : Icons.star_border,
                          size: 16,
                          color: Colors.amber,
                        );
                      }),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSizes.p12),
          Text(
            review,
            style: AppTextStyles.bodyText,
          ),
        ],
      ),
    );
  }
}