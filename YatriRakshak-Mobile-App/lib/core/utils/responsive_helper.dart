import 'package:flutter/material.dart';

class ResponsiveHelper {
  static const double _baseWidth = 390.0; // iPhone 12 Pro width
  static const double _baseHeight = 844.0; // iPhone 12 Pro height

  final BuildContext context;
  final MediaQueryData _mediaQuery;

  ResponsiveHelper(this.context) : _mediaQuery = MediaQuery.of(context);

  // Device type getters
  bool get isSmallScreen => screenWidth < 360;
  bool get isMediumScreen => screenWidth >= 360 && screenWidth < 600;
  bool get isTablet => screenWidth >= 600 && screenWidth < 1200;
  bool get isDesktop => screenWidth >= 1200;
  bool get isLargeScreen => screenWidth >= 900;

  // Screen dimensions
  double get screenWidth => _mediaQuery.size.width;
  double get screenHeight => _mediaQuery.size.height;
  Orientation get orientation => _mediaQuery.orientation;
  bool get isLandscape => orientation == Orientation.landscape;
  bool get isPortrait => orientation == Orientation.portrait;

  // Device pixel ratio and text scale factor
  double get devicePixelRatio => _mediaQuery.devicePixelRatio;
  double get textScaleFactor => _mediaQuery.textScaleFactor;

  // Safe area padding
  EdgeInsets get safeArea => _mediaQuery.padding;
  double get statusBarHeight => _mediaQuery.padding.top;
  double get bottomSafeArea => _mediaQuery.padding.bottom;

  // Responsive font sizes
  double fontSize(double size) {
    if (isDesktop) return size * 1.3;
    if (isLargeScreen) return size * 1.2;
    if (isTablet) return size * 1.1;
    if (isSmallScreen) return size * 0.9;
    return size * (screenWidth / _baseWidth).clamp(0.8, 1.4);
  }

  // Responsive width scaling
  double width(double size) {
    if (isDesktop) return size * 1.4;
    if (isLargeScreen) return size * 1.3;
    if (isTablet) return size * 1.15;
    if (isSmallScreen) return size * 0.85;
    return size * (screenWidth / _baseWidth).clamp(0.8, 1.4);
  }

  // Responsive height scaling
  double height(double size) {
    if (isLandscape && !isDesktop) return size * 0.7;
    return size * (screenHeight / _baseHeight).clamp(0.8, 1.4);
  }

  // Responsive padding
  EdgeInsets padding({
    double? all,
    double? horizontal,
    double? vertical,
    double? top,
    double? bottom,
    double? left,
    double? right,
  }) {
    if (all != null) {
      return EdgeInsets.all(width(all));
    }
    return EdgeInsets.only(
      top: top != null ? height(top) : (vertical != null ? height(vertical) : 0),
      bottom: bottom != null ? height(bottom) : (vertical != null ? height(vertical) : 0),
      left: left != null ? width(left) : (horizontal != null ? width(horizontal) : 0),
      right: right != null ? width(right) : (horizontal != null ? width(horizontal) : 0),
    );
  }

  // Responsive margin
  EdgeInsets margin({
    double? all,
    double? horizontal,
    double? vertical,
    double? top,
    double? bottom,
    double? left,
    double? right,
  }) {
    if (all != null) {
      return EdgeInsets.all(width(all));
    }
    return EdgeInsets.only(
      top: top != null ? height(top) : (vertical != null ? height(vertical) : 0),
      bottom: bottom != null ? height(bottom) : (vertical != null ? height(vertical) : 0),
      left: left != null ? width(left) : (horizontal != null ? width(horizontal) : 0),
      right: right != null ? width(right) : (horizontal != null ? width(horizontal) : 0),
    );
  }

  // Responsive sized box
  Widget verticalSpace(double size) => SizedBox(height: height(size));
  Widget horizontalSpace(double size) => SizedBox(width: width(size));

  // Layout helpers
  int get gridColumns {
    if (isDesktop) return 4;
    if (isLargeScreen) return 3;
    if (isTablet) return 2;
    return 1;
  }

  double get maxContentWidth {
    if (isDesktop) return 1200;
    if (isLargeScreen) return 900;
    if (isTablet) return 600;
    return screenWidth;
  }

  // Breakpoint helpers
  T breakpoint<T>({
    required T mobile,
    T? tablet,
    T? desktop,
  }) {
    if (isDesktop && desktop != null) return desktop;
    if (isTablet && tablet != null) return tablet;
    return mobile;
  }

  // Text styles with responsive sizing
  TextStyle headingLarge() => TextStyle(
    fontSize: fontSize(32),
    fontWeight: FontWeight.bold,
  );

  TextStyle headingMedium() => TextStyle(
    fontSize: fontSize(24),
    fontWeight: FontWeight.w600,
  );

  TextStyle headingSmall() => TextStyle(
    fontSize: fontSize(20),
    fontWeight: FontWeight.w600,
  );

  TextStyle bodyLarge() => TextStyle(
    fontSize: fontSize(16),
    fontWeight: FontWeight.normal,
  );

  TextStyle bodyMedium() => TextStyle(
    fontSize: fontSize(14),
    fontWeight: FontWeight.normal,
  );

  TextStyle bodySmall() => TextStyle(
    fontSize: fontSize(12),
    fontWeight: FontWeight.normal,
  );

  TextStyle caption() => TextStyle(
    fontSize: fontSize(10),
    fontWeight: FontWeight.normal,
  );
}

// Extension for easier access
extension ResponsiveExtension on BuildContext {
  ResponsiveHelper get responsive => ResponsiveHelper(this);
}

// Responsive widget builder
class ResponsiveBuilder extends StatelessWidget {
  final Widget Function(BuildContext context, ResponsiveHelper responsive) builder;

  const ResponsiveBuilder({
    Key? key,
    required this.builder,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return builder(context, ResponsiveHelper(context));
  }
}

// Responsive layout wrapper
class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveLayout({
    Key? key,
    required this.mobile,
    this.tablet,
    this.desktop,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final responsive = ResponsiveHelper(context);
    
    if (responsive.isDesktop && desktop != null) {
      return desktop!;
    }
    
    if (responsive.isTablet && tablet != null) {
      return tablet!;
    }
    
    return mobile;
  }
}