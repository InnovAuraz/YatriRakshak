import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import '../../../core/widgets/bottom_nav.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  LatLng? _currentLocation;
  late final MapController _mapController;
  bool _isLocationLoading = true;
  String _locationError = '';
  int _currentTileProvider = 0; // Track current tile provider

  // Default location (Kolkata) in case location services fail
  final LatLng _defaultLocation = const LatLng(22.5726, 88.3639);

  // List of tile providers with proper attribution
// Alternative tile providers section - replace the _tileProviders list with this:
  final List<Map<String, dynamic>> _tileProviders = [
    {
      'name': 'CartoDB Voyager',
      'urlTemplate': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      'attribution': '© OpenStreetMap, © CartoDB',
      'subdomains': ['a', 'b', 'c'],
    },
    {
      'name': 'CartoDB Positron',
      'urlTemplate': 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      'attribution': '© OpenStreetMap, © CartoDB',
      'subdomains': ['a', 'b', 'c'],
    },
    {
      'name': 'Stamen Terrain',
      'urlTemplate': 'https://stamen-tiles.{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
      'attribution': 'Map tiles by Stamen Design',
      'subdomains': ['a', 'b', 'c', 'd'],
    },
  ];
  // Hotels
  final Map<String, LatLng> _allHotelLocations = {
    'Elite Business Hotel': const LatLng(22.5726, 88.3639),
    'The Grand Plaza Hotel': const LatLng(22.5750, 88.3700),
    'SafeStay Inn & Suites': const LatLng(22.5700, 88.3650),
    'Kolkata Royal Hotel': const LatLng(22.5730, 88.3680),
    'Park Street Residence': const LatLng(22.5710, 88.3620),
  };

  final Map<String, double> _hotelSafetyScores = {
    'Elite Business Hotel': 9.5,
    'The Grand Plaza Hotel': 9.2,
    'SafeStay Inn & Suites': 8.8,
    'Kolkata Royal Hotel': 9.0,
    'Park Street Residence': 8.5,
  };

  final Map<String, String> _hotelTypes = {
    'Elite Business Hotel': 'Premium',
    'The Grand Plaza Hotel': 'Premium',
    'SafeStay Inn & Suites': 'Budget',
    'Kolkata Royal Hotel': 'Women-Safe',
    'Park Street Residence': 'Budget',
  };

  // Filters
  double _minSafetyScore = 8.0;
  Set<String> _selectedTypes = {'Premium', 'Budget', 'Women-Safe'};

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
    _initializeLocation();
  }

  Future<void> _initializeLocation() async {
    try {
      await _requestLocationPermissionAndListen();
    } catch (e) {
      setState(() {
        _locationError = 'Location service unavailable. Using default location.';
        _currentLocation = _defaultLocation;
        _isLocationLoading = false;
      });
    }
  }

  Future<void> _requestLocationPermissionAndListen() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Location services are disabled.');
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
    }

    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      throw Exception('Location permissions are denied.');
    }

    // Get initial location
    final position = await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );

    setState(() {
      _currentLocation = LatLng(position.latitude, position.longitude);
      _isLocationLoading = false;
    });

    // Listen to location updates
    Geolocator.getPositionStream(
      locationSettings: const LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10,
      ),
    ).listen((Position pos) {
      final updatedLocation = LatLng(pos.latitude, pos.longitude);
      setState(() {
        _currentLocation = updatedLocation;
      });
      _mapController.move(updatedLocation, _mapController.zoom);
    });
  }

  Color _getMarkerColor(double safetyScore) {
    if (safetyScore >= 9.0) return Colors.green;
    if (safetyScore >= 8.0) return Colors.orange;
    return Colors.red;
  }

  IconData _getMarkerIcon(String type) {
    switch (type) {
      case 'Premium':
        return Icons.hotel;
      case 'Women-Safe':
        return Icons.security;
      case 'Budget':
        return Icons.home;
      default:
        return Icons.location_on;
    }
  }

  void _showHotelInfo(String hotelName, double safetyScore, String type) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(hotelName),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.security, color: _getMarkerColor(safetyScore), size: 16),
                const SizedBox(width: 8),
                Text('Safety Score: ${safetyScore.toStringAsFixed(1)}/10'),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.category, color: Colors.blue, size: 16),
                const SizedBox(width: 8),
                Text('Type: $type'),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.location_on, color: Colors.grey, size: 16),
                const SizedBox(width: 8),
                const Text('Kolkata, India'),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('View Details'),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (_) {
        double tempScore = _minSafetyScore;
        Set<String> tempTypes = Set.from(_selectedTypes);

        return StatefulBuilder(builder: (context, setStateDialog) {
          return AlertDialog(
            title: const Text('Filter Hotels'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Minimum Safety Score:'),
                Slider(
                  value: tempScore,
                  min: 5.0,
                  max: 10.0,
                  divisions: 5,
                  label: tempScore.toStringAsFixed(1),
                  onChanged: (val) {
                    setStateDialog(() => tempScore = val);
                  },
                ),
                Text('${tempScore.toStringAsFixed(1)}/10', style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                const Text('Hotel Type:'),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: ['Premium', 'Budget', 'Women-Safe'].map((type) {
                    return FilterChip(
                      label: Text(type),
                      selected: tempTypes.contains(type),
                      onSelected: (selected) {
                        setStateDialog(() {
                          if (selected) {
                            tempTypes.add(type);
                          } else {
                            tempTypes.remove(type);
                          }
                        });
                      },
                    );
                  }).toList(),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _minSafetyScore = tempScore;
                    _selectedTypes = tempTypes;
                  });
                  Navigator.pop(context);
                },
                child: const Text('Apply Filters'),
              ),
            ],
          );
        });
      },
    );
  }

  void _showTileProviderDialog() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Choose Map Style'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: _tileProviders.asMap().entries.map((entry) {
            final index = entry.key;
            final provider = entry.value;
            return ListTile(
              leading: Radio(
                value: index,
                groupValue: _currentTileProvider,
                onChanged: (value) {
                  setState(() {
                    _currentTileProvider = value!;
                  });
                  Navigator.pop(context);
                },
              ),
              title: Text(provider['name']),
              subtitle: Text(provider['attribution']),
            );
          }).toList(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  void _centerMapOnLocation() {
    if (_currentLocation != null) {
      _mapController.move(_currentLocation!, 15.0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final displayLocation = _currentLocation ?? _defaultLocation;
    final currentProvider = _tileProviders[_currentTileProvider];

    final filteredHotels = _allHotelLocations.entries.where((entry) {
      final score = _hotelSafetyScores[entry.key] ?? 0.0;
      final type = _hotelTypes[entry.key] ?? '';
      return score >= _minSafetyScore && _selectedTypes.contains(type);
    }).toList();

    return Scaffold(
      body: _isLocationLoading
          ? const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 20),
            Text('Loading your location...'),
          ],
        ),
      )
          : Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              center: displayLocation,
              zoom: 15.0,
            ),
            children: [
              // Tile Layer with proper attribution
              TileLayer(
                urlTemplate: currentProvider['urlTemplate'],
                userAgentPackageName: 'com.example.hotelsafetyapp',
                subdomains: currentProvider['subdomains'],
              ),
              // Proper attribution widget
              RichAttributionWidget(
                attributions: [
                  TextSourceAttribution(
                    currentProvider['attribution'],
                    onTap: () => _showTileProviderDialog(),
                  ),
                ],
              ),
              MarkerLayer(
                markers: [
                  // Current location marker
                  Marker(
                    point: displayLocation,
                    width: 50,
                    height: 50,
                    builder: (context) => const Icon(
                      Icons.my_location,
                      color: Colors.blue,
                      size: 35,
                    ),
                  ),
                  // Hotel markers
                  ...filteredHotels.map((entry) {
                    final score = _hotelSafetyScores[entry.key] ?? 0.0;
                    final type = _hotelTypes[entry.key] ?? '';
                    return Marker(
                      point: entry.value,
                      width: 50,
                      height: 50,
                      builder: (context) => GestureDetector(
                        onTap: () => _showHotelInfo(entry.key, score, type),
                        child: Column(
                          children: [
                            Icon(
                              _getMarkerIcon(type),
                              color: _getMarkerColor(score),
                              size: 30,
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.2),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Text(
                                score.toStringAsFixed(1),
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: _getMarkerColor(score),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ],
              ),
            ],
          ),
          // Header Card
          Positioned(
            top: MediaQuery.of(context).padding.top + 16,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on, color: Colors.deepPurple),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Kolkata, India',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey[800],
                          ),
                        ),
                        Text(
                          '${filteredHotels.length} hotels nearby',
                          style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                        ),
                        if (_locationError.isNotEmpty)
                          Text(
                            _locationError,
                            style: const TextStyle(fontSize: 12, color: Colors.orange),
                          ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.map, color: Colors.deepPurple),
                    onPressed: _showTileProviderDialog,
                    tooltip: 'Change Map Style',
                  ),
                  IconButton(
                    icon: const Icon(Icons.filter_list, color: Colors.deepPurple),
                    onPressed: _showFilterDialog,
                    tooltip: 'Filter Hotels',
                  ),
                  IconButton(
                    icon: const Icon(Icons.my_location, color: Colors.deepPurple),
                    onPressed: _centerMapOnLocation,
                    tooltip: 'Center on Location',
                  ),
                ],
              ),
            ),
          ),
          // Filter Info Chip
          if (_minSafetyScore > 8.0 || _selectedTypes.length < 3)
            Positioned(
              top: MediaQuery.of(context).padding.top + 120,
              left: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.deepPurple,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.filter_alt, color: Colors.white, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      'Filters Active',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar: const AppBottomNav(currentIndex: 1),
    );
  }
}