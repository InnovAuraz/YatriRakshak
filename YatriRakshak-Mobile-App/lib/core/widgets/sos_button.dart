import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:yatri_rakshak/core/theme/text_styles.dart';

import '../constrants/app_colors.dart';
import '../constrants/app_strings.dart';

class SOSButton extends StatefulWidget {
  const SOSButton({super.key});

  @override
  State<SOSButton> createState() => _SOSButtonState();
}

class _SOSButtonState extends State<SOSButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onLongPressDown: (_) {
        setState(() {
          _isPressed = true;
        });
        // Haptic feedback on press
        HapticFeedback.heavyImpact();
      },
      onLongPressUp: () {
        setState(() {
          _isPressed = false;
        });
        // Another haptic feedback on release
        HapticFeedback.heavyImpact();
        // Navigate to SOS Alert Page
        context.push('/sos-alert');
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        width: _isPressed ? 220 : 200,
        height: _isPressed ? 220 : 200,
        decoration: BoxDecoration(
          color: AppColors.sos,
          shape: BoxShape.circle,
          boxShadow: _isPressed
              ? [
            BoxShadow(
              color: AppColors.sos.withOpacity(0.5),
              spreadRadius: 10,
              blurRadius: 20,
            ),
          ]
              : [],
        ),
        child: Center(
          child: Text(
            AppStrings.sosButtonText,
            textAlign: TextAlign.center,
            style: AppTextStyles.buttonText.copyWith(
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}