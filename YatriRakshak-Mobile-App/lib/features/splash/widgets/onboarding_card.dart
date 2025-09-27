import 'package:flutter/material.dart';
import 'package:yatri_rakshak/core/theme/text_styles.dart';

class OnboardingCard extends StatelessWidget {
  final String title;
  final String description;
  final String? iconPath;
  final Color? cardColor;
  final double borderRadius;
  final List<BoxShadow>? shadow;

  const OnboardingCard({
    super.key,
    required this.title,
    required this.description,
    this.iconPath,
    this.cardColor,
    this.borderRadius = 24.0,
    this.shadow,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        padding: const EdgeInsets.all(24.0),
        decoration: BoxDecoration(
          color: cardColor ?? Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(borderRadius),
          boxShadow: shadow ??
              [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 12,
                  offset: Offset(0, 6),
                ),
              ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Image or icon
            if (iconPath != null)
              Image.asset(
                iconPath!,
                height: 200,
                width: 200,
                fit: BoxFit.contain,
              )
            else
              Container(
                height: 200,
                width: 200,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Center(child: Text('Image Placeholder')),
              ),
            const SizedBox(height: 32),
            Text(
              title,
              style: AppTextStyles.headline1.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Text(
                description,
                style: AppTextStyles.bodyText.copyWith(color: Colors.white70),
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
