import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/widgets/bottom_nav.dart';
//-----------------
// Responsive Helper
// -------------------------
class Responsive {
  final BuildContext context;
  late double screenWidth;
  late double screenHeight;

  Responsive(this.context) {
    screenWidth = MediaQuery.of(context).size.width;
    screenHeight = MediaQuery.of(context).size.height;
  }

  double wp(double percent) => screenWidth * (percent / 100);
  double hp(double percent) => screenHeight * (percent / 100);
  double sp(double size) => (screenWidth / 390) * size; // base width = 390
}


// -------------------------
// Dashboard Screen
// -------------------------
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final r = Responsive(context);

    return Scaffold(
      appBar: null,
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
        child: SafeArea(
          child: SingleChildScrollView(
            padding: EdgeInsets.all(r.wp(4)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildGreetingSection(context),
                SizedBox(height: r.hp(3)),
                _buildSafetyScoreSection(context),
                SizedBox(height: r.hp(3)),
                _buildQuickActionsSection(context),
                SizedBox(height: r.hp(3)),
                _buildAlertFeedSection(context),
                SizedBox(height: r.hp(3)),
                _buildTrustedContactsSection(context),
                SizedBox(height: r.hp(3)),
                _buildQRCodeSection(context),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: const AppBottomNav(currentIndex: 0),
    );
  }

  // Greeting Section
  Widget _buildGreetingSection(BuildContext context) {
    final r = Responsive(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Yatri Rakhshak',
          style: TextStyle(
            fontSize: r.sp(28),
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        SizedBox(height: r.hp(1)),
        Text(
          'Good afternoon, Swapnil',
          style: TextStyle(
            fontSize: r.sp(20),
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        SizedBox(height: r.hp(0.5)),
        Text(
          'Stay safe on your travels',
          style: TextStyle(
            fontSize: r.sp(16),
            color: Colors.white.withOpacity(0.8),
          ),
        ),
      ],
    );
  }

  // Safety Score
  Widget _buildSafetyScoreSection(BuildContext context) {
    final r = Responsive(context);
    return Container(
      padding: EdgeInsets.all(r.wp(4)),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Safety Score',
                style: TextStyle(
                  fontSize: r.sp(18),
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
              Container(
                padding: EdgeInsets.symmetric(
                  horizontal: r.wp(3),
                  vertical: r.hp(0.5),
                ),
                decoration: BoxDecoration(
                  color: Colors.amber.shade700,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Area risk: Medium',
                  style: TextStyle(
                    fontSize: r.sp(14),
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: r.hp(2)),
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: r.wp(30),
                height: r.wp(30),
                child: CircularProgressIndicator(
                  value: 0.78,
                  strokeWidth: r.wp(3),
                  backgroundColor: Colors.white.withOpacity(0.2),
                  valueColor:
                  AlwaysStoppedAnimation<Color>(Colors.green.shade400),
                ),
              ),
              Text(
                '78',
                style: TextStyle(
                  fontSize: r.sp(32),
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          SizedBox(height: r.hp(1.5)),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('7 days ago',
                  style: TextStyle(
                      fontSize: r.sp(14),
                      color: Colors.white.withOpacity(0.7))),
              Text('24h',
                  style: TextStyle(
                      fontSize: r.sp(14),
                      color: Colors.white.withOpacity(0.7))),
              Text('Now',
                  style: TextStyle(
                      fontSize: r.sp(14),
                      color: Colors.white.withOpacity(0.7))),
            ],
          ),
        ],
      ),
    );
  }

  // Quick Actions
  Widget _buildQuickActionsSection(BuildContext context) {
    final r = Responsive(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: TextStyle(
            fontSize: r.sp(18),
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        SizedBox(height: r.hp(1.5)),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildActionButton(context,
                icon: Icons.warning,
                label: 'Emergency SOS',
                color: Colors.red.shade400,
                onTap: () => context.push('/sos-alert')),
            _buildActionButton(context,
                icon: Icons.check_circle,
                label: 'Check-in Safe',
                color: Colors.green.shade400),
            _buildActionButton(context,
                icon: Icons.location_on,
                label: 'Share Location',
                color: Colors.blue.shade400),
            _buildActionButton(context,
                icon: Icons.report,
                label: 'Report Issue',
                color: Colors.orange.shade400),
          ],
        ),
      ],
    );
  }

  Widget _buildActionButton(BuildContext context,
      {required IconData icon, required String label, required Color color, VoidCallback? onTap}) {
    final r = Responsive(context);
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: r.wp(15),
            height: r.wp(15),
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            child: Icon(icon, color: Colors.white, size: r.sp(28)),
          ),
          SizedBox(height: r.hp(1)),
          SizedBox(
            width: r.wp(18),
            child: Text(
              label,
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: r.sp(12), color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  // Alert Feed
  Widget _buildAlertFeedSection(BuildContext context) {
    final r = Responsive(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Alert Feed',
            style: TextStyle(
                fontSize: r.sp(18),
                fontWeight: FontWeight.w600,
                color: Colors.white)),
        SizedBox(height: r.hp(1.5)),
        _buildAlertItem(context,
            title: 'Weather Alert',
            status: 'Active',
            statusColor: Colors.red.shade400,
            description:
            'Heavy rainfall expected in Delhi NCR region. Avoid outdoor activities.',
            time: '3 hours ago'),
        SizedBox(height: r.hp(1.5)),
        _buildAlertItem(context,
            title: 'Geo-fence Alert',
            status: 'New',
            statusColor: Colors.blue.shade400,
            description: "You\'ve entered a monitored area. Stay alert.",
            time: 'Just now'),
        SizedBox(height: r.hp(1.5)),
        _buildAlertItem(context,
            title: 'Nearby Advisory',
            status: 'High',
            statusColor: Colors.orange.shade400,
            description:
            'Road closure reported 500m ahead. Take alternative route.',
            time: '1 hour ago'),
      ],
    );
  }

  Widget _buildAlertItem(BuildContext context,
      {required String title,
        required String status,
        required Color statusColor,
        required String description,
        required String time}) {
    final r = Responsive(context);
    return Container(
      padding: EdgeInsets.all(r.wp(4)),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text(title,
                style: TextStyle(
                    fontSize: r.sp(16),
                    fontWeight: FontWeight.w600,
                    color: Colors.white)),
            Container(
              padding: EdgeInsets.symmetric(
                  horizontal: r.wp(2), vertical: r.hp(0.5)),
              decoration: BoxDecoration(
                  color: statusColor,
                  borderRadius: BorderRadius.circular(12)),
              child: Text(status,
                  style: TextStyle(
                      fontSize: r.sp(12),
                      color: Colors.white,
                      fontWeight: FontWeight.bold)),
            )
          ]),
          SizedBox(height: r.hp(1)),
          Text(description,
              style: TextStyle(
                  fontSize: r.sp(14), color: Colors.white.withOpacity(0.9))),
          SizedBox(height: r.hp(1)),
          Text(time,
              style: TextStyle(
                  fontSize: r.sp(12), color: Colors.white.withOpacity(0.6))),
        ],
      ),
    );
  }

  // Trusted Contacts
  Widget _buildTrustedContactsSection(BuildContext context) {
    final r = Responsive(context);
    return Container(
      padding: EdgeInsets.all(r.wp(4)),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text('Trusted Contacts',
              style: TextStyle(
                  fontSize: r.sp(16),
                  fontWeight: FontWeight.w600,
                  color: Colors.white)),
          Text('Manage',
              style: TextStyle(fontSize: r.sp(14), color: Colors.blue.shade300)),
        ]),
        SizedBox(height: r.hp(1.5)),
        Text('3 Emergency Contacts',
            style: TextStyle(
                fontSize: r.sp(14), color: Colors.white.withOpacity(0.8))),
        SizedBox(height: r.hp(1)),
        Wrap(spacing: r.wp(2), children: [
          _buildContactChip(context, 'Mom'),
          _buildContactChip(context, 'Dad'),
          _buildContactChip(context, 'Emergency Contact'),
        ])
      ]),
    );
  }

  Widget _buildContactChip(BuildContext context, String name) {
    final r = Responsive(context);
    return Chip(
      label: Text(name,
          style: TextStyle(fontSize: r.sp(12), color: Colors.white)),
      backgroundColor: Colors.deepPurple.shade400,
    );
  }

  // QR Code
  Widget _buildQRCodeSection(BuildContext context) {
    final r = Responsive(context);
    return Container(
      padding: EdgeInsets.all(r.wp(4)),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('Add Tourista ID to hotel check-in',
            style: TextStyle(
                fontSize: r.sp(16),
                fontWeight: FontWeight.w600,
                color: Colors.white)),
        SizedBox(height: r.hp(1)),
        Text('Show your QR code for faster, safer check-ins',
            style: TextStyle(
                fontSize: r.sp(14), color: Colors.white.withOpacity(0.8))),
        SizedBox(height: r.hp(1.5)),
        Center(
            child: ElevatedButton(
              onPressed: () {
                // Handle QR code display
              },
              style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20))),
              child: Text('Show QR',
                  style: TextStyle(
                      color: Colors.deepPurple.shade800, fontSize: r.sp(14))),
            ))
      ]),
    );
  }
}
