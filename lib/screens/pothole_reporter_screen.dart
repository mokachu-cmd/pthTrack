import 'dart:io';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import '../services/location_service.dart';
import '../services/image_service.dart';
import '../services/firebase_service.dart';

class PotholeReporterScreen extends StatefulWidget {
  const PotholeReporterScreen({super.key});

  @override
  State<PotholeReporterScreen> createState() => _PotholeReporterScreenState();
}

class _PotholeReporterScreenState extends State<PotholeReporterScreen> {
  ReportStatus _status = ReportStatus.locating;
  Position? _location;
  File? _imageFile;
  String? _error;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    try {
      final position = await LocationService.getCurrentLocation();
      setState(() {
        _location = position;
        _status = ReportStatus.idle;
        _error = null;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _status = ReportStatus.error;
      });
    }
  }

  Future<void> _takePicture() async {
    try {
      final image = await ImageService.takePicture();
      if (image != null) {
        setState(() {
          _imageFile = image;
          _status = ReportStatus.preview;
        });
      }
    } catch (e) {
      setState(() {
        _error = e.toString();
        _status = ReportStatus.error;
      });
    }
  }

  Future<void> _retakePicture() async {
    setState(() {
      _imageFile = null;
      _status = ReportStatus.idle;
    });
    await _takePicture();
  }

  Future<void> _submitReport() async {
    if (_imageFile == null || _location == null) return;

    setState(() {
      _isSubmitting = true;
      _status = ReportStatus.submitting;
    });

    try {
      // Convert image to base64 for storage
      final base64Image = await ImageService.fileToBase64(_imageFile!);
      
      await FirebaseService.submitPotholeReport(
        imageUrl: base64Image,
        latitude: _location!.latitude,
        longitude: _location!.longitude,
      );

      setState(() {
        _status = ReportStatus.success;
        _isSubmitting = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _status = ReportStatus.error;
        _isSubmitting = false;
      });
    }
  }

  void _resetForm() {
    setState(() {
      _imageFile = null;
      _status = ReportStatus.idle;
      _error = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Report Pothole'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: _buildContent(),
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    switch (_status) {
      case ReportStatus.locating:
        return _buildLoadingState('Getting your location...');
      
      case ReportStatus.error:
        return _buildErrorState();
      
      case ReportStatus.idle:
        return _buildIdleState();
      
      case ReportStatus.preview:
        return _buildPreviewState();
      
      case ReportStatus.submitting:
        return _buildLoadingState('Submitting your report...');
      
      case ReportStatus.success:
        return _buildSuccessState();
    }
  }

  Widget _buildLoadingState(String message) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF3F51B5)),
        ),
        const SizedBox(height: 24),
        Text(
          message,
          style: const TextStyle(fontSize: 16, color: Colors.grey),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildErrorState() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
          Icons.error_outline,
          size: 64,
          color: Colors.red,
        ),
        const SizedBox(height: 16),
        const Text(
          'Error',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.red,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          _error ?? 'An unknown error occurred',
          style: const TextStyle(fontSize: 16, color: Colors.grey),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          onPressed: _getCurrentLocation,
          child: const Text('Try Again'),
        ),
      ],
    );
  }

  Widget _buildIdleState() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
          Icons.camera_alt,
          size: 64,
          color: Color(0xFF3F51B5),
        ),
        const SizedBox(height: 16),
        const Text(
          'Ready to Report',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Color(0xFF3F51B5),
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Tap the button below to take a picture of a pothole.',
          style: TextStyle(fontSize: 16, color: Colors.grey),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton.icon(
            onPressed: _takePicture,
            icon: const Icon(Icons.camera_alt),
            label: const Text(
              'Take Picture',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPreviewState() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.file(
            _imageFile!,
            width: double.infinity,
            height: 200,
            fit: BoxFit.cover,
          ),
        ),
        const SizedBox(height: 16),
        if (_location != null) ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.location_on,
                  color: Color(0xFF3F51B5),
                  size: 20,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Lat: ${_location!.latitude.toStringAsFixed(5)}, '
                    'Lon: ${_location!.longitude.toStringAsFixed(5)}',
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _retakePicture,
                icon: const Icon(Icons.refresh),
                label: const Text('Retake'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF3F51B5),
                  side: const BorderSide(color: Color(0xFF3F51B5)),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitReport,
                child: _isSubmitting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text('Submit Report'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSuccessState() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
          Icons.check_circle,
          size: 64,
          color: Colors.green,
        ),
        const SizedBox(height: 16),
        const Text(
          'Report Submitted!',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.green,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Thank you for helping improve our roads.',
          style: TextStyle(fontSize: 16, color: Colors.grey),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: _resetForm,
            child: const Text(
              'Report Another Pothole',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
          ),
        ),
      ],
    );
  }
}

enum ReportStatus {
  locating,
  error,
  idle,
  preview,
  submitting,
  success,
}