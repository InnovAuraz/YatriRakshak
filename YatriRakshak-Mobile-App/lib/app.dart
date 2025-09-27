import 'package:flutter/material.dart';
import 'package:yatri_rakshak/config/routes.dart';

import 'core/constrants/app_theme.dart';
import 'l10n/app_localizations.dart';

class YatriRakshakApp extends StatefulWidget {
  const YatriRakshakApp({super.key});

  @override
  State<YatriRakshakApp> createState() => _YatriRakshakAppState();

  static void setLocale(BuildContext context, Locale newLocale) {
    _YatriRakshakAppState? state = context.findAncestorStateOfType<_YatriRakshakAppState>();
    state?.setLocale(newLocale);
  }
}

class _YatriRakshakAppState extends State<YatriRakshakApp> {
  Locale? _locale;

  void setLocale(Locale newLocale) {
    setState(() {
      _locale = newLocale;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: AppTheme.themeModeNotifier,
      builder: (context, themeMode, child) {
        return MaterialApp.router(
          debugShowCheckedModeBanner: false,
          title: 'Yatri Rakshak',
          themeMode: themeMode,
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          locale: _locale, // Use the state-managed locale
          routerConfig: AppRoutes.router,
        );
      },
    );
  }
}