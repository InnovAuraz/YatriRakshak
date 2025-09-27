import 'package:flutter/material.dart';
import 'package:yatri_rakshak/core/utils/responsive_helper.dart';

class ResponsiveDashboard extends StatelessWidget {
  const ResponsiveDashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ResponsiveBuilder(
      builder: (context, responsive) {
        return Scaffold(
          backgroundColor: Colors.grey[100],
          appBar: AppBar(
            title: Text(
              'Yatri Rakshak Dashboard',
              style: responsive.headingMedium().copyWith(
                color: Colors.white,
              ),
            ),
            backgroundColor: Colors.deepPurple,
            elevation: 0,
          ),
          body: SafeArea(
            child: Padding(
              padding: responsive.padding(horizontal: 16, vertical: 16),
              child: responsive.isTablet
                  ? _buildTabletLayout(responsive)
                  : _buildMobileLayout(responsive),
            ),
          ),
        );
      },
    );
  }

  Widget _buildMobileLayout(ResponsiveHelper responsive) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWelcomeCard(responsive),
          responsive.verticalSpace(20),
          _buildQuickActions(responsive),
          responsive.verticalSpace(20),
          _buildSafetyStatus(responsive),
          responsive.verticalSpace(20),
          _buildRecentAlerts(responsive),
        ],
      ),
    );
  }

  Widget _buildTabletLayout(ResponsiveHelper responsive) {
    return SingleChildScrollView(
      child: Column(
        children: [
          _buildWelcomeCard(responsive),
          responsive.verticalSpace(20),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 2,
                child: Column(
                  children: [
                    _buildQuickActions(responsive),
                    responsive.verticalSpace(16),
                    _buildSafetyStatus(responsive),
                  ],
                ),
              ),
              responsive.horizontalSpace(20),
              Expanded(
                flex: 1,
                child: _buildRecentAlerts(responsive),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeCard(ResponsiveHelper responsive) {
    return Container(
      width: double.infinity,
      padding: responsive.padding(all: 20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.deepPurple.shade600, Colors.blue.shade400],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(responsive.width(16)),
        boxShadow: [
          BoxShadow(
            color: Colors.deepPurple.withOpacity(0.3),
            blurRadius: responsive.width(10),
            offset: Offset(0, responsive.height(4)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.shield_outlined,
                color: Colors.white,
                size: responsive.breakpoint(
                  mobile: responsive.width(30),
                  tablet: responsive.width(35),
                  desktop: responsive.width(40),
                ),
              ),
              responsive.horizontalSpace(12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Stay Safe!',
                      style: responsive.headingMedium().copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    responsive.verticalSpace(4),
                    Text(
                      'Your safety is our priority',
                      style: responsive.bodyMedium().copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions(ResponsiveHelper responsive) {
    final actions = [
      {'icon': Icons.warning, 'title': 'Emergency SOS', 'color': Colors.red},
      {'icon': Icons.location_on, 'title': 'Share Location', 'color': Colors.green},
      {'icon': Icons.contacts, 'title': 'Guardians', 'color': Colors.blue},
      {'icon': Icons.settings, 'title': 'Settings', 'color': Colors.orange},
    ];

    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(responsive.width(12)),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: responsive.width(8),
            offset: Offset(0, responsive.height(2)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Quick Actions',
            style: responsive.headingSmall().copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.grey[800],
            ),
          ),
          responsive.verticalSpace(16),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: responsive.breakpoint(
                mobile: 2,
                tablet: 4,
                desktop: 4,
              ),
              crossAxisSpacing: responsive.width(12),
              mainAxisSpacing: responsive.width(12),
              childAspectRatio: 1.2,
            ),
            itemCount: actions.length,
            itemBuilder: (context, index) {
              final action = actions[index];
              return InkWell(
                onTap: () {
                  // Handle action tap
                },
                borderRadius: BorderRadius.circular(responsive.width(8)),
                child: Container(
                  padding: responsive.padding(all: 12),
                  decoration: BoxDecoration(
                    color: (action['color'] as Color).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(responsive.width(8)),
                    border: Border.all(
                      color: (action['color'] as Color).withOpacity(0.2),
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        action['icon'] as IconData,
                        color: action['color'] as Color,
                        size: responsive.breakpoint(
                          mobile: responsive.width(24),
                          tablet: responsive.width(28),
                          desktop: responsive.width(32),
                        ),
                      ),
                      responsive.verticalSpace(8),
                      Text(
                        action['title'] as String,
                        style: responsive.bodySmall().copyWith(
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[700],
                        ),
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSafetyStatus(ResponsiveHelper responsive) {
    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(responsive.width(12)),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: responsive.width(8),
            offset: Offset(0, responsive.height(2)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Safety Status',
            style: responsive.headingSmall().copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.grey[800],
            ),
          ),
          responsive.verticalSpace(16),
          Row(
            children: [
              Container(
                width: responsive.width(12),
                height: responsive.width(12),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.green,
                ),
              ),
              responsive.horizontalSpace(12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'All Systems Active',
                      style: responsive.bodyMedium().copyWith(
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[800],
                      ),
                    ),
                    Text(
                      'Background monitoring enabled',
                      style: responsive.bodySmall().copyWith(
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRecentAlerts(ResponsiveHelper responsive) {
    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(responsive.width(12)),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: responsive.width(8),
            offset: Offset(0, responsive.height(2)),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Recent Alerts',
            style: responsive.headingSmall().copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.grey[800],
            ),
          ),
          responsive.verticalSpace(16),
          Text(
            'No recent alerts',
            style: responsive.bodyMedium().copyWith(
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }
}