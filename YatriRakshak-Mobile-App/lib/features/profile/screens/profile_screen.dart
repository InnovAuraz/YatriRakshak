import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:yatri_rakshak/core/widgets/bottom_nav.dart';
import 'package:yatri_rakshak/core/constrants/app_sizes.dart';
import 'package:yatri_rakshak/core/services/background_service.dart';
import 'package:yatri_rakshak/core/utils/responsive_helper.dart';
import 'digital_it.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  // Switch states
  bool liveLocationSharing = true;
  bool offlineMode = false;
  bool anonymizeReviews = true;
  bool autoDeleteData = false;

  // Emergency contacts list
  List<Map<String, dynamic>> contacts = [];
  bool _isLoading = true;
  bool _backgroundServiceEnabled = false;

  @override
  void initState() {
    super.initState();
    _ensureUserDocument();
    _loadGuardians();
    _checkBackgroundServiceStatus();
  }

  // Ensure user document exists in Firestore
  Future<void> _ensureUserDocument() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        final userDoc = FirebaseFirestore.instance.collection('users').doc(user.uid);
        final docSnapshot = await userDoc.get();

        if (!docSnapshot.exists) {
          // Create user document if it doesn't exist
          await userDoc.set({
            'email': user.email ?? '',
            'displayName': user.displayName ?? '',
            'createdAt': FieldValue.serverTimestamp(),
            'lastUpdated': FieldValue.serverTimestamp(),
          });
          print('✅ User document created for: ${user.uid}');
        } else {
          print('✅ User document exists for: ${user.uid}');
        }
      }
    } catch (e) {
      print('Error ensuring user document: $e');
    }
  }

  // Load guardians from Firebase
  Future<void> _loadGuardians() async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        print('⚠️ No authenticated user found');
        setState(() => _isLoading = false);
        return;
      }

      print('🔄 Loading guardians for user: ${user.uid}');

      final snapshot = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .collection('guardians')
          .orderBy('createdAt', descending: true)
          .get();

      print('📊 Found ${snapshot.docs.length} guardians');

      setState(() {
        contacts = snapshot.docs.map((doc) {
          final data = doc.data();
          return {
            'id': doc.id,
            'name': data['name'] ?? 'Unknown',
            'phone': data['number'] ?? 'No phone',
            'type': 'Guardian',
            'isActive': data['isActive'] ?? true,
          };
        }).toList();
        _isLoading = false;
      });

      print('✅ Guardians loaded successfully');
    } catch (e) {
      print('❌ Error loading guardians: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Add new guardian
  Future<void> _addGuardian(String name, String phone) async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user == null) {
        throw Exception('User not authenticated');
      }

      print('🔄 Adding guardian for user: ${user.uid}');
      print('📝 Guardian details - Name: $name, Phone: $phone');

      // Ensure user document exists first
      await _ensureUserDocument();

      // Add guardian to subcollection
      final docRef = await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .collection('guardians')
          .add({
        'name': name.trim(),
        'number': phone.trim(),
        'createdAt': FieldValue.serverTimestamp(),
        'isActive': true,
      });

      print('✅ Guardian added with ID: ${docRef.id}');

      // Reload guardians
      await _loadGuardians();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('✅ $name added as guardian'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      print('❌ Error adding guardian: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to add guardian: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  // Delete guardian
  Future<void> _deleteGuardian(String id) async {
    try {
      final user = FirebaseAuth.instance.currentUser;
      if (user != null) {
        await FirebaseFirestore.instance
            .collection('users')
            .doc(user.uid)
            .collection('guardians')
            .doc(id)
            .delete();

        // Reload guardians
        await _loadGuardians();

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Guardian removed successfully')),
          );
        }
      }
    } catch (e) {
      print('Error deleting guardian: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error removing guardian: $e')),
        );
      }
    }
  }

  // Check background service status
  Future<void> _checkBackgroundServiceStatus() async {
    try {
      final isRunning = await BackgroundService.isServiceRunning();
      setState(() {
        _backgroundServiceEnabled = isRunning;
      });
    } catch (e) {
      print('Error checking background service status: $e');
    }
  }

  // Toggle background service
  Future<void> _toggleBackgroundService(bool enabled) async {
    try {
      if (enabled) {
        await BackgroundService.startService();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Background protection enabled')),
          );
        }
      } else {
        await BackgroundService.stopService();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Background protection disabled')),
          );
        }
      }

      setState(() {
        _backgroundServiceEnabled = enabled;
      });
    } catch (e) {
      print('Error toggling background service: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ResponsiveBuilder(
      builder: (context, responsive) {
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
              padding: responsive.padding(horizontal: 16, vertical: 16),
              child: responsive.isTablet && responsive.isLandscape
                  ? _buildTabletLandscapeLayout(responsive)
                  : _buildMobileLayout(responsive),
            ),
          ),
          bottomNavigationBar: const AppBottomNav(currentIndex: 3),
        );
      },
    );
  }

  // ================= Responsive Layouts =================
  Widget _buildMobileLayout(ResponsiveHelper responsive) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        responsive.verticalSpace(24),
        _buildProfileHeader(responsive),
        responsive.verticalSpace(24),
        buildTouristaIdCard(context, responsive),
        responsive.verticalSpace(24),
        _buildEmergencyContacts(responsive),
        responsive.verticalSpace(16),
        // _buildSOSHistory(responsive),
        // responsive.verticalSpace(16),
        _buildLocationSharing(responsive),
        responsive.verticalSpace(16),
        _buildBackgroundProtection(responsive),
        responsive.verticalSpace(16),
        _buildOfflineMode(responsive),
        responsive.verticalSpace(24),
        _buildPrivacySettingsSection(responsive),
        responsive.verticalSpace(16),
        _buildLanguageAccessibility(responsive),
        responsive.verticalSpace(16),
        _buildAboutSupport(responsive),
        responsive.verticalSpace(24),
        _buildAppVersion(responsive),
      ],
    );
  }

  Widget _buildTabletLandscapeLayout(ResponsiveHelper responsive) {
    return Column(
      children: [
        responsive.verticalSpace(16),
        // Header section
        _buildProfileHeader(responsive),
        responsive.verticalSpace(20),
        buildTouristaIdCard(context, responsive),
        responsive.verticalSpace(20),

        // Two-column layout for tablets
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left column
            Expanded(
              flex: 1,
              child: Column(
                children: [
                  _buildEmergencyContacts(responsive),
                  responsive.verticalSpace(16),
                  _buildSOSHistory(responsive),
                  responsive.verticalSpace(16),
                  _buildLocationSharing(responsive),
                  responsive.verticalSpace(16),
                  _buildBackgroundProtection(responsive),
                ],
              ),
            ),
            responsive.horizontalSpace(20),

            // Right column
            Expanded(
              flex: 1,
              child: Column(
                children: [
                  _buildOfflineMode(responsive),
                  responsive.verticalSpace(16),
                  _buildPrivacySettingsSection(responsive),
                  responsive.verticalSpace(16),
                  _buildLanguageAccessibility(responsive),
                ],
              ),
            ),
          ],
        ),
        responsive.verticalSpace(20),
        _buildAboutSupport(responsive),
        responsive.verticalSpace(16),
        _buildAppVersion(responsive),
      ],
    );
  }

  // ================= Profile Header =================
  Widget _buildProfileHeader(ResponsiveHelper responsive) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: responsive.width(80),
          height: responsive.width(80),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.white.withOpacity(0.2),
            border: Border.all(color: Colors.white.withOpacity(0.3), width: 2),
          ),
          child: Icon(Icons.person, size: responsive.width(50), color: Colors.white.withOpacity(0.8)),
        ),
        responsive.horizontalSpace(16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Swapnil Shaw',
                  style: TextStyle(
                    fontSize: responsive.fontSize(24),
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  )),
              responsive.verticalSpace(4),
              Row(
                children: [
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: responsive.width(8), vertical: responsive.height(4)),
                    decoration: BoxDecoration(
                      color: Colors.greenAccent.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.greenAccent.withOpacity(0.5)),
                    ),
                    child: Text(
                      'Verified Traveler',
                      style: TextStyle(
                        fontSize: responsive.fontSize(12),
                        color: Colors.greenAccent.shade200,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  responsive.horizontalSpace(8),
                  Text('ID: TID-2024-789',
                      style: TextStyle(
                        fontSize: responsive.fontSize(14),
                        color: Colors.white.withOpacity(0.7),
                      )),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ================= Tourista ID Card =================
  Widget buildTouristaIdCard(
      BuildContext context,
      ResponsiveHelper responsive,
      ) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(responsive.width(16)),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Show Yatri Rakshak ID',
              style: responsive.bodyLarge().copyWith(
                fontWeight: FontWeight.w600,
                color: Colors.white,
              )),
          responsive.verticalSpace(12),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                  context, MaterialPageRoute(builder: (context) => DigitalTravelIdScreen()));
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.deepPurple.shade800,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              padding: EdgeInsets.symmetric(
                horizontal: responsive.width(24),
                vertical: responsive.height(12),
              ),
            ),
            child: Text('Show ID', style: responsive.bodyMedium()),
          ),
        ],
      ),
    );
  }

  // ================= Emergency Contacts with Edit/Delete =================
  Widget _buildEmergencyContacts(ResponsiveHelper responsive) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(
                  Icons.security,
                  color: Colors.white,
                  size: responsive.width(20),
                ),
                responsive.horizontalSpace(8),
                Text('Emergency Guardians',
                    style: responsive.bodyLarge().copyWith(
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    )),
              ],
            ),
            Container(
              decoration: BoxDecoration(
                color: Colors.green.shade600,
                borderRadius: BorderRadius.circular(20),
              ),
              child: TextButton.icon(
                onPressed: () => _showAddEditContactBottomSheet(responsive),
                icon: Icon(Icons.add, color: Colors.white, size: responsive.width(16)),
                label: Text(
                  'Add Guardian',
                  style: responsive.bodySmall().copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: TextButton.styleFrom(
                  padding: EdgeInsets.symmetric(
                    horizontal: responsive.width(12),
                    vertical: responsive.height(4),
                  ),
                ),
              ),
            ),
          ],
        ),
        responsive.verticalSpace(8),
        Container(
          padding: EdgeInsets.all(responsive.width(12)),
          decoration: BoxDecoration(
            color: Colors.blue.shade800.withOpacity(0.3),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: Colors.blue.shade700.withOpacity(0.3)),
          ),
          child: Row(
            children: [
              Icon(Icons.info_outline, color: Colors.blue.shade200, size: responsive.width(16)),
              responsive.horizontalSpace(8),
              Expanded(
                child: Text(
                  contacts.isEmpty
                      ? 'Add trusted contacts who will be notified in emergency situations'
                      : '${contacts.length} guardian${contacts.length != 1 ? 's' : ''} will be contacted during SOS alerts',
                  style: responsive.bodySmall().copyWith(
                    color: Colors.blue.shade100,
                  ),
                ),
              ),
            ],
          ),
        ),
        responsive.verticalSpace(12),
        // Show loading or contacts list
        if (_isLoading)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(20.0),
              child: CircularProgressIndicator(color: Colors.white),
            ),
          )
        else if (contacts.isEmpty)
          Container(
            padding: EdgeInsets.all(responsive.width(20)),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withOpacity(0.2)),
            ),
            child: Column(
              children: [
                Icon(
                  Icons.contact_emergency,
                  color: Colors.white.withOpacity(0.7),
                  size: responsive.width(40),
                ),
                responsive.verticalSpace(12),
                Text(
                  'No emergency guardians added yet',
                  style: responsive.bodyLarge().copyWith(
                    color: Colors.white.withOpacity(0.8),
                  ),
                  textAlign: TextAlign.center,
                ),
                responsive.verticalSpace(8),
                Text(
                  'Add trusted contacts who can help in emergencies',
                  style: responsive.bodySmall().copyWith(
                    color: Colors.white.withOpacity(0.6),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          )
        else
          ...contacts.asMap().entries.map((entry) {
            Map<String, dynamic> contact = entry.value;
            return Dismissible(
              key: Key(contact['id'] ?? contact['phone']!),
              background: Container(
                color: Colors.red,
                alignment: Alignment.centerRight,
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: const Icon(Icons.delete, color: Colors.white),
              ),
              direction: DismissDirection.endToStart,
              confirmDismiss: (direction) async {
                return await showDialog(
                  context: context,
                  builder: (BuildContext context) {
                    return AlertDialog(
                      title: const Text('Delete Guardian'),
                      content: Text('Are you sure you want to remove ${contact['name']} as your emergency guardian?'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.of(context).pop(false),
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          onPressed: () => Navigator.of(context).pop(true),
                          child: const Text('Delete', style: TextStyle(color: Colors.red)),
                        ),
                      ],
                    );
                  },
                );
              },
              onDismissed: (_) {
                if (contact['id'] != null) {
                  _deleteGuardian(contact['id']!);
                }
              },
              child: GestureDetector(
                onTap: () => _showAddEditContactBottomSheet(responsive, contact: contact),
                child: Padding(
                  padding: EdgeInsets.only(bottom: responsive.height(12)),
                  child: _buildContactItem(
                    name: contact['name']!,
                    phone: contact['phone']!,
                    type: contact['type']!,
                    responsive: responsive,
                    contact: contact,
                  ),
                ),
              ),
            );
          }),
      ],
    );
  }

  // Show delete confirmation dialog
  void _showDeleteConfirmation(Map<String, dynamic> contact) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Remove Guardian'),
          content: Text('Are you sure you want to remove ${contact['name']} from your emergency guardians list?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                if (contact['id'] != null) {
                  _deleteGuardian(contact['id']!);
                }
              },
              child: const Text('Remove', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }

  void _showAddEditContactBottomSheet(
      ResponsiveHelper responsive,
      {Map<String, dynamic>? contact}) {
    final nameController = TextEditingController(text: contact?['name']);
    final phoneController = TextEditingController(text: contact?['phone']);
    final isEditing = contact != null;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          left: responsive.width(16),
          right: responsive.width(16),
          top: responsive.height(16),
          bottom: MediaQuery.of(context).viewInsets.bottom + responsive.height(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Icon(
                  Icons.security,
                  color: Colors.deepPurple,
                  size: responsive.width(24),
                ),
                responsive.horizontalSpace(8),
                Text(
                  isEditing ? 'Edit Emergency Guardian' : 'Add Emergency Guardian',
                  style: responsive.bodyLarge().copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            responsive.verticalSpace(16),
            if (!isEditing) ...[
              Container(
                padding: EdgeInsets.all(responsive.width(12)),
                decoration: BoxDecoration(
                  color: Colors.orange.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.orange.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info, color: Colors.orange.shade700, size: responsive.width(20)),
                    responsive.horizontalSpace(8),
                    Expanded(
                      child: Text(
                        'This person will be contacted in emergencies via SMS and phone calls.',
                        style: responsive.bodySmall().copyWith(
                          color: Colors.orange.shade800,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              responsive.verticalSpace(16),
            ],
            TextField(
              controller: nameController,
              decoration: InputDecoration(
                labelText: 'Guardian Name',
                prefixIcon: const Icon(Icons.person),
                border: const OutlineInputBorder(),
                labelStyle: responsive.bodySmall(),
              ),
              style: responsive.bodyMedium(),
            ),
            responsive.verticalSpace(12),
            TextField(
              controller: phoneController,
              keyboardType: TextInputType.phone,
              decoration: InputDecoration(
                labelText: 'Phone Number',
                prefixIcon: const Icon(Icons.phone),
                border: const OutlineInputBorder(),
                hintText: '+1 234 567 8900',
                labelStyle: responsive.bodySmall(),
              ),
              style: responsive.bodyMedium(),
            ),
            responsive.verticalSpace(20),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text('Cancel', style: responsive.bodyMedium()),
                  ),
                ),
                responsive.horizontalSpace(12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      if (nameController.text.isNotEmpty && phoneController.text.isNotEmpty) {
                        Navigator.pop(context);
                        if (isEditing) {
                          // TODO: Implement update guardian functionality
                          print('Update guardian functionality needed');
                        } else {
                          _addGuardian(nameController.text, phoneController.text);
                        }
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Please fill in all fields')),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      foregroundColor: Colors.white,
                    ),
                    child: Text(isEditing ? 'Update' : 'Add Guardian', style: responsive.bodyMedium()),
                  ),
                ),
              ],
            ),
            responsive.verticalSpace(12),
          ],
        ),
      ),
    );
  }

  // ================= SOS History =================
  Widget _buildSOSHistory(ResponsiveHelper responsive) {
    return Card(
      color: Colors.grey[900],
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: responsive.padding(all: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.history,
                  color: Colors.white,
                  size: responsive.width(20),
                ),
                responsive.horizontalSpace(8),
                Text(
                  'SOS History',
                  style: responsive.bodyLarge().copyWith(
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
            responsive.verticalSpace(12),
            StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('users')
                  .doc(FirebaseAuth.instance.currentUser?.uid)
                  .collection('sos_alerts')
                  .orderBy('timestamp', descending: true)
                  .limit(5)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(
                    child: CircularProgressIndicator(
                      color: Colors.red.shade400,
                      strokeWidth: 2,
                    ),
                  );
                }

                if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                  return Container(
                    padding: responsive.padding(all: 16),
                    decoration: BoxDecoration(
                      color: Colors.grey[800],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.info_outline,
                          color: Colors.grey[400],
                          size: responsive.width(18),
                        ),
                        responsive.horizontalSpace(8),
                        Text(
                          'No SOS alerts recorded',
                          style: responsive.bodyMedium().copyWith(
                            color: Colors.grey[400],
                          ),
                        ),
                      ],
                    ),
                  );
                }

                final alerts = snapshot.data!.docs;

                return Column(
                  children: [
                    ...alerts.take(3).map((doc) {
                      final data = doc.data() as Map<String, dynamic>;
                      final timestamp = (data['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now();
                      final status = data['status'] ?? 'sent';
                      final type = data['type'] ?? 'emergency';

                      return Container(
                        margin: EdgeInsets.only(bottom: responsive.height(8)),
                        padding: responsive.padding(all: 12),
                        decoration: BoxDecoration(
                          color: Colors.grey[800],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.fromBorderSide(
                            BorderSide(
                              width: 3,
                              color: _getStatusColor(status),
                            ),
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              _getAlertIcon(type),
                              color: _getStatusColor(status),
                              size: responsive.width(18),
                            ),
                            responsive.horizontalSpace(12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    _getAlertTitle(type),
                                    style: responsive.bodyMedium().copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  responsive.verticalSpace(2),
                                  Text(
                                    _formatTimestamp(timestamp),
                                    style: responsive.bodySmall().copyWith(
                                      color: Colors.grey[400],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(
                                horizontal: responsive.width(8),
                                vertical: responsive.height(4),
                              ),
                              decoration: BoxDecoration(
                                color: _getStatusColor(status).withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                status.toUpperCase(),
                                style: responsive.bodySmall().copyWith(
                                  color: _getStatusColor(status),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),

                    if (alerts.length > 3)
                      Container(
                        width: double.infinity,
                        margin: EdgeInsets.only(top: responsive.height(8)),
                        child: TextButton(
                          onPressed: () => _showFullSOSHistory(),
                          style: TextButton.styleFrom(
                            backgroundColor: Colors.grey[800],
                            foregroundColor: Colors.blue.shade400,
                            padding: EdgeInsets.symmetric(
                              vertical: responsive.height(12),
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            'View All History (${alerts.length})',
                            style: responsive.bodyMedium().copyWith(
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  // Helper methods for SOS History
  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'sent':
        return Colors.green;
      case 'delivered':
        return Colors.blue;
      case 'failed':
        return Colors.red;
      case 'cancelled':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  IconData _getAlertIcon(String type) {
    switch (type.toLowerCase()) {
      case 'emergency':
        return Icons.warning;
      case 'medical':
        return Icons.medical_services;
      case 'accident':
        return Icons.car_crash;
      case 'theft':
        return Icons.security;
      case 'harassment':
        return Icons.report;
      default:
        return Icons.emergency;
    }
  }

  String _getAlertTitle(String type) {
    switch (type.toLowerCase()) {
      case 'emergency':
        return 'Emergency Alert';
      case 'medical':
        return 'Medical Emergency';
      case 'accident':
        return 'Accident Alert';
      case 'theft':
        return 'Theft Report';
      case 'harassment':
        return 'Harassment Report';
      default:
        return 'SOS Alert';
    }
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${timestamp.day}/${timestamp.month}/${timestamp.year}';
    }
  }

  void _showFullSOSHistory() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _buildFullHistoryModal(),
    );
  }

  Widget _buildFullHistoryModal() {
    final responsive = ResponsiveHelper(context);

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: Colors.grey[900],
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        children: [
          // Handle bar
          Container(
            margin: responsive.padding(top: 8, bottom: 8),
            width: responsive.width(40),
            height: responsive.height(4),
            decoration: BoxDecoration(
              color: Colors.grey[600],
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: responsive.padding(horizontal: 20, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Complete SOS History',
                  style: responsive.headingSmall().copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: Colors.white),
                ),
              ],
            ),
          ),

          Divider(color: Colors.grey[700], height: 1),

          // Full history list
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('users')
                  .doc(FirebaseAuth.instance.currentUser?.uid)
                  .collection('sos_alerts')
                  .orderBy('timestamp', descending: true)
                  .snapshots(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(
                    child: CircularProgressIndicator(color: Colors.red.shade400),
                  );
                }

                if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.history,
                          size: responsive.width(64),
                          color: Colors.grey[600],
                        ),
                        responsive.verticalSpace(16),
                        Text(
                          'No SOS alerts recorded',
                          style: responsive.bodyLarge().copyWith(
                            color: Colors.grey[400],
                          ),
                        ),
                      ],
                    ),
                  );
                }

                final alerts = snapshot.data!.docs;

                return ListView.builder(
                  padding: responsive.padding(all: 20),
                  itemCount: alerts.length,
                  itemBuilder: (context, index) {
                    final data = alerts[index].data() as Map<String, dynamic>;
                    final timestamp = (data['timestamp'] as Timestamp?)?.toDate() ?? DateTime.now();
                    final status = data['status'] ?? 'sent';
                    final type = data['type'] ?? 'emergency';
                    final location = data['location'] as Map<String, dynamic>?;

                    return Container(
                      margin: EdgeInsets.only(bottom: responsive.height(12)),
                      padding: responsive.padding(all: 16),
                      decoration: BoxDecoration(
                        color: Colors.grey[800],
                        borderRadius: BorderRadius.circular(12),
                        border: Border.fromBorderSide(
                          BorderSide(
                            width: 4,
                            color: _getStatusColor(status),
                          ),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                _getAlertIcon(type),
                                color: _getStatusColor(status),
                                size: responsive.width(20),
                              ),
                              responsive.horizontalSpace(12),
                              Expanded(
                                child: Text(
                                  _getAlertTitle(type),
                                  style: responsive.bodyLarge().copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                              Container(
                                padding: responsive.padding(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: _getStatusColor(status).withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  status.toUpperCase(),
                                  style: responsive.bodySmall().copyWith(
                                    color: _getStatusColor(status),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          responsive.verticalSpace(8),
                          Text(
                            'Sent on ${timestamp.day}/${timestamp.month}/${timestamp.year} at ${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}',
                            style: responsive.bodyMedium().copyWith(
                              color: Colors.grey[400],
                            ),
                          ),
                          if (location != null) ...[
                            responsive.verticalSpace(4),
                            Row(
                              children: [
                                Icon(
                                  Icons.location_on,
                                  size: responsive.width(14),
                                  color: Colors.grey[500],
                                ),
                                responsive.horizontalSpace(4),
                                Text(
                                  'Lat: ${location['latitude']?.toStringAsFixed(4)}, Long: ${location['longitude']?.toStringAsFixed(4)}',
                                  style: responsive.bodySmall().copyWith(
                                    color: Colors.grey[500],
                                  ),
                                ),
                              ],
                            ),
                          ],
                          if (data['message'] != null) ...[
                            responsive.verticalSpace(8),
                            Text(
                              data['message'],
                              style: responsive.bodyMedium().copyWith(
                                color: Colors.grey[300],
                              ),
                            ),
                          ],
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  // ================= Contact Item UI =================
  Widget _buildContactItem({
    required String name,
    required String phone,
    required String type,
    required ResponsiveHelper responsive,
    required Map<String, dynamic> contact,
  }) {
    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          Container(
            width: responsive.width(50),
            height: responsive.width(50),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.deepPurple.shade100.withOpacity(0.3),
            ),
            child: Icon(Icons.person, color: Colors.white.withOpacity(0.8)),
          ),
          responsive.horizontalSpace(16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(name, style: responsive.bodyLarge().copyWith(fontWeight: FontWeight.w600, color: Colors.white)),
                    responsive.horizontalSpace(8),
                    Container(
                      padding: responsive.padding(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: Colors.green.withOpacity(0.4)),
                      ),
                      child: Text(
                        'GUARDIAN',
                        style: responsive.bodySmall().copyWith(
                          fontSize: 10,
                          color: Colors.green.shade300,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                responsive.verticalSpace(4),
                Text(phone, style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.7))),
                responsive.verticalSpace(4),
                Text('Will be contacted in emergencies', style: responsive.bodySmall().copyWith(color: Colors.white.withOpacity(0.6))),
              ],
            ),
          ),
          PopupMenuButton<String>(
            icon: Icon(Icons.more_vert, color: Colors.white.withOpacity(0.7)),
            onSelected: (value) {
              if (value == 'edit') {
                _showAddEditContactBottomSheet(responsive, contact: contact);
              } else if (value == 'delete') {
                _showDeleteConfirmation(contact);
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'edit',
                child: Row(
                  children: [
                    Icon(Icons.edit, size: 18),
                    SizedBox(width: 8),
                    Text('Edit'),
                  ],
                ),
              ),
              const PopupMenuItem(
                value: 'delete',
                child: Row(
                  children: [
                    Icon(Icons.delete, size: 18, color: Colors.red),
                    SizedBox(width: 8),
                    Text('Delete', style: TextStyle(color: Colors.red)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ================= Location Sharing Switch =================
  Widget _buildLocationSharing(
      ResponsiveHelper responsive) {
    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Live Location Sharing', style: responsive.bodyLarge().copyWith(fontWeight: FontWeight.w600, color: Colors.white)),
              Switch(
                value: liveLocationSharing,
                onChanged: (v) => setState(() => liveLocationSharing = v),
                activeColor: Colors.deepPurple.shade800,
                activeTrackColor: Colors.white,
              ),
            ],
          ),
          responsive.verticalSpace(8),
          Text('Share with emergency contacts', style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.7))),
          responsive.verticalSpace(12),
          Text('Sharing with:', style: responsive.bodyMedium().copyWith(fontWeight: FontWeight.w600, color: Colors.white)),
          responsive.verticalSpace(8),
          Row(
            children: [
              Icon(Icons.circle, size: responsive.width(12), color: Colors.greenAccent.shade200),
              responsive.horizontalSpace(8),
              Text('Sarah Johnson', style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.8))),
            ],
          ),
          responsive.verticalSpace(4),
          Row(
            children: [
              Icon(Icons.circle, size: responsive.width(12), color: Colors.greenAccent.shade200),
              responsive.horizontalSpace(8),
              Text('Embassy USA', style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.8))),
            ],
          ),
        ],
      ),
    );
  }

  // ================= Background Protection Switch =================
  Widget _buildBackgroundProtection(
      ResponsiveHelper responsive) {
    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.shield, color: Colors.white, size: responsive.width(20)),
                  responsive.horizontalSpace(8),
                  Text('Background Protection', style: responsive.bodyLarge().copyWith(fontWeight: FontWeight.w600, color: Colors.white)),
                ],
              ),
              Switch(
                value: _backgroundServiceEnabled,
                onChanged: _toggleBackgroundService,
                activeColor: Colors.green.shade400,
                activeTrackColor: Colors.white,
              ),
            ],
          ),
          responsive.verticalSpace(8),
          Text(
              _backgroundServiceEnabled
                  ? 'Active monitoring for fall detection and location tracking'
                  : 'Enable 24/7 safety monitoring even when app is closed',
              style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.7))
          ),
          if (_backgroundServiceEnabled) ...[
            responsive.verticalSpace(12),
            Container(
              padding: responsive.padding(all: 8),
              decoration: BoxDecoration(
                color: Colors.green.shade800.withOpacity(0.3),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(Icons.check_circle, size: responsive.width(16), color: Colors.green.shade300),
                  responsive.horizontalSpace(8),
                  Expanded(
                    child: Text(
                      'Protected: Fall detection, location monitoring, and emergency alerts active',
                      style: responsive.bodySmall().copyWith(color: Colors.green.shade200),
                    ),
                  ),
                ],
              ),
            ),
          ] else ...[
            responsive.verticalSpace(12),
            Container(
              padding: responsive.padding(all: 8),
              decoration: BoxDecoration(
                color: Colors.orange.shade800.withOpacity(0.3),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(Icons.warning, size: responsive.width(16), color: Colors.orange.shade300),
                  responsive.horizontalSpace(8),
                  Expanded(
                    child: Text(
                      'Limited protection: SOS features only work when app is open',
                      style: responsive.bodySmall().copyWith(color: Colors.orange.shade200),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ================= Offline Mode Switch =================
  Widget _buildOfflineMode(
      ResponsiveHelper responsive) {
    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Offline Mode', style: responsive.bodyLarge().copyWith(fontWeight: FontWeight.w600, color: Colors.white)),
                responsive.verticalSpace(8),
                Text('SMS fallback when no internet', style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.7))),
              ],
            ),
          ),
          Switch(
            value: offlineMode,
            onChanged: (v) => setState(() => offlineMode = v),
            activeColor: Colors.deepPurple.shade800,
            activeTrackColor: Colors.white,
          ),
        ],
      ),
    );
  }

  // ================= Privacy & Settings =================
  Widget _buildPrivacySettingsSection(
      ResponsiveHelper responsive) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Privacy & Settings', style: responsive.headingSmall().copyWith(fontWeight: FontWeight.bold, color: Colors.white)),
        responsive.verticalSpace(16),
        _buildPrivacySettingItem('Anonymize Reviews', 'Hide identity in public reviews', true, anonymizeReviews, responsive, (v) => setState(() => anonymizeReviews = v)),
        responsive.verticalSpace(12),
        _buildPrivacySettingItem('Auto-delete Data', 'Remove data after trip ends', true, autoDeleteData, responsive, (v) => setState(() => autoDeleteData = v)),
        responsive.verticalSpace(12),
        _buildPrivacySettingItem('SOS History', 'View emergency alerts', false, false, responsive, null),
        responsive.verticalSpace(12),
        _buildPrivacySettingItem('Community', 'Helpers and reports', false, false, responsive, null),
      ],
    );
  }

  Widget _buildPrivacySettingItem(String title, String subtitle, bool hasSwitch, bool value,
      ResponsiveHelper responsive,
      Function(bool)? onChanged) {
    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(title, style: responsive.bodyLarge().copyWith(fontWeight: FontWeight.w600, color: Colors.white)),
              responsive.verticalSpace(4),
              Text(subtitle, style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.7))),
            ]),
          ),
          if (hasSwitch)
            Switch(value: value, onChanged: onChanged, activeColor: Colors.deepPurple.shade800, activeTrackColor: Colors.white)
          else
            Icon(Icons.arrow_forward_ios, color: Colors.white.withOpacity(0.7), size: responsive.width(20)),
        ],
      ),
    );
  }

  // ================= Remaining UI unchanged =================
  Widget _buildLanguageAccessibility(
      ResponsiveHelper responsive) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Language & Accessibility', style: responsive.headingSmall().copyWith(fontWeight: FontWeight.bold, color: Colors.white)),
        responsive.verticalSpace(16),
        _buildLanguageAccessibilityItem(title: 'Language', value: 'English (US)', responsive: responsive),
        responsive.verticalSpace(12),
        _buildLanguageAccessibilityItem(title: 'Font Size', value: 'Medium', responsive: responsive),
        responsive.verticalSpace(12),
        _buildLanguageAccessibilityItem(title: 'Voice Assist', value: 'Audio guidance', responsive: responsive),
      ],
    );
  }

  Widget _buildLanguageAccessibilityItem({
    required String title,
    required String value,
    required ResponsiveHelper responsive,
  }) {
    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: responsive.bodyLarge().copyWith(fontWeight: FontWeight.w600, color: Colors.white)),
          Row(
            children: [
              Text(value, style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.7))),
              responsive.horizontalSpace(8),
              Icon(Icons.arrow_forward_ios, color: Colors.white.withOpacity(0.7), size: responsive.width(16)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAboutSupport(
      ResponsiveHelper responsive) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('About & Support', style: responsive.headingSmall().copyWith(fontWeight: FontWeight.bold, color: Colors.white)),
        responsive.verticalSpace(16),
        _buildAboutSupportItem(title: 'Help Center', subtitle: 'FAQs and guides', responsive: responsive),
        responsive.verticalSpace(12),
        _buildAboutSupportItem(title: 'Contact Support', subtitle: 'Get help from our team', responsive: responsive),
        responsive.verticalSpace(12),
        _buildAboutSupportItem(title: 'Privacy Policy', subtitle: 'How we protect your data', responsive: responsive),
        responsive.verticalSpace(12),
        _buildAboutSupportItem(title: 'Terms of Service', subtitle: 'Usage terms and conditions', responsive: responsive),
      ],
    );
  }

  Widget _buildAboutSupportItem({
    required String title,
    required String subtitle,
    required ResponsiveHelper responsive,
  }) {
    return Container(
      padding: responsive.padding(all: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: responsive.bodyLarge().copyWith(fontWeight: FontWeight.w600, color: Colors.white)),
                responsive.verticalSpace(4),
                Text(subtitle, style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.7))),
              ],
            ),
          ),
          Icon(Icons.arrow_forward_ios, color: Colors.white.withOpacity(0.7), size: responsive.width(20)),
        ],
      ),
    );
  }

  Widget _buildAppVersion(ResponsiveHelper responsive) {
    return Center(
      child: Text('Yatri Rakshak Safety v1.0.0', style: responsive.bodyMedium().copyWith(color: Colors.white.withOpacity(0.6))),
    );
  }
}