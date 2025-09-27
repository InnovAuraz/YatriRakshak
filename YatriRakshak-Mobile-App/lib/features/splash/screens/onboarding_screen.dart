import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:yatri_rakshak/core/widgets/custom_button.dart';
import 'package:yatri_rakshak/features/splash/widgets/onboarding_card.dart';
import '../../../core/constrants/app_strings.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> onboardingData = [
    {
      'title': AppStrings.onboardTitle1,
      'description': AppStrings.onboardDesc1,
      'icon': 'assets/images/onboarding1.png',
    },
    {
      'title': AppStrings.onboardTitle2,
      'description': AppStrings.onboardDesc2,
      'icon': 'assets/images/onboarding2.png',
    },
    {
      'title': AppStrings.onboardTitle3,
      'description': AppStrings.onboardDesc3,
      'icon': 'assets/images/onboarding3.png',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.deepPurple.shade800, Colors.blue.shade400],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (index) {
                    setState(() {
                      _currentPage = index;
                    });
                  },
                  itemCount: onboardingData.length,
                  itemBuilder: (context, index) {
                    return OnboardingCard(
                      title: onboardingData[index]['title']!,
                      description: onboardingData[index]['description']!,
                      iconPath: onboardingData[index]['icon']!,
                      cardColor: Colors.white.withOpacity(0.15),
                      borderRadius: 24,
                      shadow: [
                        BoxShadow(
                          color: Colors.black26,
                          blurRadius: 12,
                          offset: Offset(0, 6),
                        ),
                      ],
                    );
                  },
                ),
              ),

              const SizedBox(height: 16),

              // Animated page indicators
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  onboardingData.length,
                      (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 6.0),
                    height: 10.0,
                    width: _currentPage == index ? 28.0 : 10.0,
                    decoration: BoxDecoration(
                      color: _currentPage == index
                          ? Colors.tealAccent
                          : Colors.white38,
                      borderRadius: BorderRadius.circular(5),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // Next / Get Started Button
              SizedBox(
                width: double.infinity,
                child: CustomButton(
                  text: _currentPage == onboardingData.length - 1
                      ? AppStrings.getStarted
                      : AppStrings.next,
                  gradient: LinearGradient(
                    colors: [Colors.purple.shade400, Colors.blue.shade300],
                  ),
                  borderRadius: 24,
                  height: 55,
                  onPressed: () {
                    if (_currentPage == onboardingData.length - 1) {
                      context.go('/login');
                    } else {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 400),
                        curve: Curves.easeInOut,
                      );
                    }
                  },
                  textStyle: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}
