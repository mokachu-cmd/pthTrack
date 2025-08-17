import 'package:cloud_firestore/cloud_firestore.dart';

class PotholeReport {
  final String id;
  final String imageUrl;
  final double latitude;
  final double longitude;
  final DateTime reportedAt;

  PotholeReport({
    required this.id,
    required this.imageUrl,
    required this.latitude,
    required this.longitude,
    required this.reportedAt,
  });

  factory PotholeReport.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return PotholeReport(
      id: doc.id,
      imageUrl: data['imageUrl'] ?? '',
      latitude: (data['latitude'] ?? 0.0).toDouble(),
      longitude: (data['longitude'] ?? 0.0).toDouble(),
      reportedAt: (data['reportedAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'imageUrl': imageUrl,
      'latitude': latitude,
      'longitude': longitude,
      'reportedAt': Timestamp.fromDate(reportedAt),
    };
  }
}