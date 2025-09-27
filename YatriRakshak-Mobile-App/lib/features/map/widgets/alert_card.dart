import 'package:flutter/material.dart';
import 'package:yatri_rakshak/core/theme/text_styles.dart';
import 'package:yatri_rakshak/core/widgets/custom_card.dart';

import '../../../core/constrants/app_sizes.dart';

class AlertCard extends StatelessWidget {
  final String title;
  final String description;

  const AlertCard({
    super.key,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 280,
      child: CustomCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              title,
              style: AppTextStyles.cardTitle,
            ),
            const SizedBox(height: AppSizes.p8),
            Text(
              description,
              style: AppTextStyles.bodyText,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}