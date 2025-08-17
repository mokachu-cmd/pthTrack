# Pothole Tracker Flutter App

A Flutter mobile application for reporting potholes with location and images, built to replace the Next.js web version.

## Features

- 📸 **Camera Integration**: Take pictures of potholes using device camera
- 📍 **GPS Location**: Automatically capture GPS coordinates
- ☁️ **Firebase Integration**: Store reports in Cloud Firestore
- 📱 **Material Design**: Clean, intuitive UI following Material Design principles
- 🎨 **Custom Theming**: Deep blue primary color with bright orange accents
- 📋 **Reports List**: View all submitted pothole reports

## Getting Started

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Android Studio or VS Code with Flutter extensions
- Firebase project setup

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Cloud Firestore and Firebase Storage
3. Download `google-services.json` for Android and place it in `android/app/`
4. Update `lib/firebase_options.dart` with your Firebase configuration

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   flutter pub get
   ```
3. Configure Firebase (see Firebase Setup above)
4. Run the app:
   ```bash
   flutter run
   ```

### Building APK

To build a release APK:

```bash
flutter build apk --release
```

The APK will be generated at `build/app/outputs/flutter-apk/app-release.apk`

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── firebase_options.dart     # Firebase configuration
├── models/
│   └── pothole_report.dart   # Data model for pothole reports
├── services/
│   ├── firebase_service.dart # Firebase operations
│   ├── location_service.dart # GPS location handling
│   └── image_service.dart    # Camera and image operations
├── screens/
│   ├── home_screen.dart      # Main navigation screen
│   ├── pothole_reporter_screen.dart # Report creation screen
│   └── reports_screen.dart   # View all reports screen
└── widgets/
    └── report_card.dart      # Individual report display widget
```

## Permissions

The app requires the following permissions:
- Camera access (for taking photos)
- Location access (for GPS coordinates)
- Internet access (for Firebase communication)
- Storage access (for image handling)

## Design Guidelines

- **Primary Color**: Deep blue (#3F51B5) - evokes trust and reliability
- **Background**: Light gray (#F0F0F5) - clean, neutral interface
- **Accent Color**: Bright orange (#FF9800) - draws attention to important actions
- **Typography**: PT Sans font family for clear readability
- **Icons**: Material Design icons for consistency

## Firebase Collections

### potholes
```json
{
  "imageUrl": "string (base64 data URI or download URL)",
  "latitude": "number",
  "longitude": "number", 
  "reportedAt": "timestamp"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.