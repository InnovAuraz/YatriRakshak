import 'package:flutter/material.dart';
import 'package:yatri_rakshak/core/utils/dummy_data.dart';
import 'package:yatri_rakshak/core/theme/text_styles.dart';

import '../../../core/constrants/app_sizes.dart';

class VolunteersScreen extends StatelessWidget {
  const VolunteersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(AppSizes.p16),
      itemCount: DummyData.dummyVolunteers.length,
      separatorBuilder: (context, index) => const SizedBox(height: AppSizes.p12),
      itemBuilder: (context, index) {
        final volunteer = DummyData.dummyVolunteers[index];
        return ListTile(
          leading: const CircleAvatar(
            child: Icon(Icons.person),
          ),
          title: Text(volunteer['name']!, style: AppTextStyles.bodyText),
          subtitle: Text(volunteer['city']!, style: AppTextStyles.bodyText),
          trailing: Chip(
            label: Text(volunteer['badge']!, style: const TextStyle(fontSize: 12)),
          ),
        );
      },
    );
  }
}