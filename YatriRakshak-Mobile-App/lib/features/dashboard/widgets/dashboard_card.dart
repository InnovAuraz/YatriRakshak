import 'package:flutter/material.dart';
import 'package:yatri_rakshak/core/theme/text_styles.dart';
import 'package:yatri_rakshak/core/widgets/custom_card.dart';

class DashboardCard extends StatefulWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;
  final Color? color;
  final List<BoxShadow>? shadow;
  final double borderRadius;

  const DashboardCard({
    super.key,
    required this.title,
    required this.icon,
    required this.onTap,
    this.color,
    this.shadow,
    this.borderRadius = 20.0,
  });

  @override
  State<DashboardCard> createState() => _DashboardCardState();
}

class _DashboardCardState extends State<DashboardCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 150),
      lowerBound: 0.0,
      upperBound: 0.05,
    );

    _scaleAnimation =
        Tween<double>(begin: 1.0, end: 0.95).animate(_controller);
  }

  void _onTapDown(TapDownDetails details) {
    _controller.forward();
  }

  void _onTapUp(TapUpDetails details) {
    _controller.reverse();
    widget.onTap();
  }

  void _onTapCancel() {
    _controller.reverse();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: _onTapCancel,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: child,
          );
        },
        child: CustomCard(
          borderRadius: widget.borderRadius,
          shadow: widget.shadow ??
              [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Glowing icon
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: (widget.color ?? Colors.tealAccent)
                          .withOpacity(0.6),
                      blurRadius: 20,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: Icon(
                  widget.icon,
                  size: 48,
                  color: widget.color ?? Colors.tealAccent,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                widget.title,
                style: AppTextStyles.cardTitle.copyWith(color: Colors.white),
              ),
            ],
          ),
        ),
      ),
    );
  }
}