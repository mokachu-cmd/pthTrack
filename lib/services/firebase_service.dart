import 'dart:io';
import 'dart:convert';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import '../models/pothole_report.dart';

class FirebaseService {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static final FirebaseStorage _storage = FirebaseStorage.instance;

  static Future<String> uploadImage(File imageFile) async {
    try {
      final String fileName = 'pothole_${DateTime.now().millisecondsSinceEpoch}.jpg';
      final Reference ref = _storage.ref().child('potholes/$fileName');
      
      final UploadTask uploadTask = ref.putFile(imageFile);
      final TaskSnapshot snapshot = await uploadTask;
      
      return await snapshot.ref.getDownloadURL();
    } catch (e) {
      throw Exception('Failed to upload image: $e');
    }
  }

  static Future<String> uploadImageAsBase64(String base64Image) async {
    try {
      // For this implementation, we'll store the base64 directly in Firestore
      // In a production app, you might want to decode and upload to Storage
      return base64Image;
    } catch (e) {
      throw Exception('Failed to process image: $e');
    }
  }

  static Future<void> submitPotholeReport({
    required String imageUrl,
    required double latitude,
    required double longitude,
  }) async {
    try {
      final report = PotholeReport(
        id: '',
        imageUrl: imageUrl,
        latitude: latitude,
        longitude: longitude,
        reportedAt: DateTime.now(),
      );

      await _firestore.collection('potholes').add(report.toFirestore());
    } catch (e) {
      throw Exception('Failed to submit report: $e');
    }
  }

  static Future<List<PotholeReport>> getPotholeReports() async {
    try {
      final QuerySnapshot snapshot = await _firestore
          .collection('potholes')
          .orderBy('reportedAt', descending: true)
          .get();

      return snapshot.docs
          .map((doc) => PotholeReport.fromFirestore(doc))
          .toList();
    } catch (e) {
      throw Exception('Failed to fetch reports: $e');
    }
  }
}