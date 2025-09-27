import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:yatri_rakshak/core/theme/text_styles.dart';
import 'package:yatri_rakshak/core/widgets/custom_card.dart';

import '../../../core/constrants/app_strings.dart';

class QrCard extends StatelessWidget {
  final String data;

  const QrCard({super.key, required this.data});

  @override
  Widget build(BuildContext context) {
    return CustomCard(
      child: Column(
        children: [
          Text(
            AppStrings.digitalIdTitle,
            style: AppTextStyles.cardTitle,
          ),
          const SizedBox(height: 16),
          QrImageView(
            data: data,
            version: QrVersions.auto,
            size: 200.0,
          ),
          const SizedBox(height: 16),
          Text(
            AppStrings.scanQr,
            style: AppTextStyles.bodyText,
          ),
        ],
      ),
    );
  }
}