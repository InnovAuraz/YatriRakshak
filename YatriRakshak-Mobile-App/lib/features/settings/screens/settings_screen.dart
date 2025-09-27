import 'package:flutter/material.dart';

import 'package:yatri_rakshak/core/theme/text_styles.dart';
import 'package:yatri_rakshak/core/widgets/app_bar.dart';
import 'package:yatri_rakshak/features/settings/widgets/language_selector.dart';

import '../../../core/constrants/app_sizes.dart';
import '../../../core/constrants/app_strings.dart';
import '../../../core/constrants/app_theme.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: AppStrings.settingsTitle),
      body: Padding(
        padding: const EdgeInsets.all(AppSizes.p16),
        child: Column(
          children: [
            ListTile(
              title: Text(AppStrings.theme, style: AppTextStyles.bodyText),
              trailing: Switch(
                value: Theme.of(context).brightness == Brightness.dark,
                onChanged: (value) {
                  AppTheme.toggleTheme();
                },
              ),
            ),
            const Divider(),
            ListTile(
              title: Text(AppStrings.language, style: AppTextStyles.bodyText),
              trailing: const LanguageSelector(),
            ),
          ],
        ),
      ),
    );
  }
}