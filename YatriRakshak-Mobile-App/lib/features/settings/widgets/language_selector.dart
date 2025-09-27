import 'package:flutter/material.dart';
import 'package:yatri_rakshak/app.dart';

import '../../../l10n/app_localizations.dart';

class LanguageSelector extends StatefulWidget {
  const LanguageSelector({super.key});

  @override
  State<LanguageSelector> createState() => _LanguageSelectorState();
}

class _LanguageSelectorState extends State<LanguageSelector> {
  final List<Locale> supportedLocales = AppLocalizations.supportedLocales.toList();

  @override
  Widget build(BuildContext context) {
    Locale currentLocale = Localizations.localeOf(context);

    return DropdownButton<Locale>(
      value: currentLocale,
      icon: const Icon(Icons.arrow_drop_down),
      onChanged: (Locale? newLocale) {
        if (newLocale != null) {
          YatriRakshakApp.setLocale(context, newLocale); // Assuming a method to change locale
        }
      },
      items: supportedLocales.map((Locale locale) {
        String languageName;
        switch (locale.languageCode) {
          case 'en':
            languageName = 'English';
            break;
          case 'hi':
            languageName = 'Hindi';
            break;
          case 'fr':
            languageName = 'French';
            break;
          default:
            languageName = locale.languageCode;
        }
        return DropdownMenuItem<Locale>(
          value: locale,
          child: Text(languageName),
        );
      }).toList(),
    );
  }
}