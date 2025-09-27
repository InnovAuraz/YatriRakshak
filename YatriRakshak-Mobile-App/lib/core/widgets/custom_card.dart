import 'package:flutter/material.dart';
import 'dart:ui';

class CustomCard extends StatelessWidget {
  final Widget child;
  final double borderRadius;
  final List<BoxShadow>? shadow;
  final Color? color;
  final EdgeInsetsGeometry? padding;
  final Gradient? gradient;

  const CustomCard({
    super.key,
    required this.child,
    this.borderRadius = 20.0,
    this.shadow,
    this.color,
    this.padding,
    this.gradient,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: Container(
        padding: padding ?? const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color ?? Colors.white.withOpacity(0.1),
          gradient: gradient,
          borderRadius: BorderRadius.circular(borderRadius),
          boxShadow: shadow ??
              [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
        ),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: child,
        ),
      ),
    );
  }
}
