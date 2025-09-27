import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:yatri_rakshak/core/utils/validators.dart';
import 'package:yatri_rakshak/features/auth/widgets/auth_text_field.dart';
import 'package:yatri_rakshak/features/auth/services/auth_service.dart';
import 'package:yatri_rakshak/core/constrants/app_strings.dart';

import '../widgets/auth_custom_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final AuthService _authService = AuthService();
  bool _isLoading = false;

  void _login() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _isLoading = true;
      });
      try {
        await _authService.signInWithEmailAndPassword(
          email: _emailController.text,
          password: _passwordController.text,
        );
        if (mounted) {
          context.go('/dashboard');
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(e.toString()),
              backgroundColor: Colors.red,
            ),
          );
        }
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

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
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 64),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Column(
                  children: [
                    Container(
                      height: 120,
                      width: 120,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: [Colors.purple.shade300, Colors.blue.shade200],
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black26,
                            blurRadius: 12,
                            offset: Offset(0, 6),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.lock_outline,
                        size: 60,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      AppStrings.loginTitle,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 32),
                  ],
                ),
                AuthTextField(
                  hintText: AppStrings.emailHint,
                  controller: _emailController,
                  validator: Validators.validateEmail,
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.15),
                  borderRadius: 16,
                ),
                const SizedBox(height: 16),
                AuthTextField(
                  hintText: AppStrings.passwordHint,
                  controller: _passwordController,
                  isPassword: true,
                  validator: Validators.validatePassword,
                  filled: true,
                  fillColor: Colors.white.withOpacity(0.15),
                  borderRadius: 16,
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {},
                    child: const Text(
                      AppStrings.forgotPassword,
                      style: TextStyle(color: Colors.white70),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                AuthCustomButton(
                  text: AppStrings.loginButton,
                  onPressed: _login,
                  gradient: LinearGradient(
                    colors: [Colors.purple.shade400, Colors.blue.shade300],
                  ),
                  borderRadius: 20,
                  height: 55,
                  textStyle: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  isLoading: _isLoading,
                ),
                const SizedBox(height: 16),
                Center(
                  child: TextButton(
                    onPressed: () {
                      context.go('/signup');
                    },
                    child: RichText(
                      text: TextSpan(
                        text: '${AppStrings.noAccount} ',
                        style: const TextStyle(color: Colors.white70, fontSize: 16),
                        children: [
                          TextSpan(
                            text: AppStrings.signupButton,
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
