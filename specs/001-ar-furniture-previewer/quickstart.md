# Quickstart Guide: AR Furniture Previewer

**Phase**: 1 - Design  
**Date**: 2025-12-04  
**Status**: Ready for Development

## Prerequisites

### Required Software

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18.x or 20.x LTS | JavaScript runtime |
| npm | 9.x+ | Package manager |
| Watchman | Latest | File watching (macOS) |
| Xcode | 15.x+ | iOS builds (macOS only) |
| Android Studio | Hedgehog+ | Android builds & emulator |
| EAS CLI | Latest | Expo build service |
| Git | 2.x+ | Version control |

### Accounts Required

| Service | Purpose | Setup Link |
|---------|---------|------------|
| Expo | Build service & OTA updates | https://expo.dev/signup |
| 8th Wall | AR engine | https://www.8thwall.com/pricing |
| Niantic Lightship | VPS & scanning | https://lightship.dev/ |

---

## Environment Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd ar-furniture-previewer
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Install EAS CLI globally
npm install -g eas-cli
```

### 3. Configure Environment Variables

Create `.env` file in project root:

```env
# 8th Wall Configuration
EIGHTH_WALL_API_KEY=your_8th_wall_api_key_here

# Lightship Configuration (optional - VPS/scanning)
LIGHTSHIP_API_KEY=your_lightship_api_key_here

# App Configuration
APP_ENV=development
DEBUG_AR=true
```

Create `eas.json` if not present:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "staging"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  }
}
```

### 4. Login to Services

```bash
# Login to Expo
eas login

# Verify login
eas whoami
```

---

## Running the App

### Development Build

Since this app uses native code (bare workflow), you need a development build:

```bash
# Build development client for iOS
eas build --profile development --platform ios

# Build development client for Android
eas build --profile development --platform android

# Or build for both
eas build --profile development --platform all
```

After build completes:

1. Download the build from Expo dashboard
2. Install on device/simulator
3. Start the development server:

```bash
npx expo start --dev-client
```

### Running on Simulators

**iOS Simulator** (macOS only):
```bash
# Start Metro bundler
npx expo start --dev-client

# In another terminal, run on simulator
npx expo run:ios
```

**Android Emulator**:
```bash
# Ensure emulator is running
# Start Metro bundler
npx expo start --dev-client

# Run on emulator
npx expo run:android
```

### Testing on Physical Devices

For AR testing, physical devices are required:

1. Build development client (see above)
2. Install on device via TestFlight (iOS) or direct APK (Android)
3. Ensure device is on same network as dev machine
4. Scan QR code from Metro bundler

---

## Project Structure

```
ar-furniture-previewer/
├── src/
│   ├── app/                    # Application layer
│   │   ├── screens/            # Screen components
│   │   ├── navigation/         # React Navigation setup
│   │   ├── components/         # Shared UI components
│   │   └── hooks/              # Custom React hooks
│   ├── core/                   # Business logic
│   │   ├── models/             # Domain entities
│   │   ├── services/           # Service interfaces
│   │   └── store/              # Zustand state
│   ├── infrastructure/         # External implementations
│   │   ├── storage/            # AsyncStorage + react-native-fs
│   │   ├── ar/                 # AR service implementation
│   │   └── webview/            # WebView bridge
│   └── shared/                 # Shared utilities
│       ├── constants/          # App constants
│       ├── types/              # TypeScript types
│       └── utils/              # Helper functions
├── web/                        # 8th Wall WebView app
│   ├── index.html              # WebView entry point
│   ├── ar-engine.ts            # 8th Wall integration
│   ├── three-renderer.ts       # Three.js rendering
│   └── bridge-client.ts        # RN bridge client
├── assets/                     # Static assets
│   ├── bundled-models/         # Pre-loaded GLB files
│   └── images/                 # App images
├── tests/                      # Test files
│   ├── unit/                   # Jest unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # Detox E2E tests
├── ios/                        # iOS native project
├── android/                    # Android native project
├── app.json                    # Expo configuration
├── eas.json                    # EAS Build configuration
├── tsconfig.json               # TypeScript config
├── jest.config.js              # Jest configuration
├── detox.config.js             # Detox E2E config
└── package.json
```

---

## Development Workflow

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/core/services/__tests__/storage.test.ts
```

### E2E Tests with Detox

```bash
# Build for E2E testing (iOS)
detox build --configuration ios.sim.debug

# Run E2E tests (iOS)
detox test --configuration ios.sim.debug

# Build for E2E testing (Android)
detox build --configuration android.emu.debug

# Run E2E tests (Android)
detox test --configuration android.emu.debug
```

### Linting & Type Checking

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Run TypeScript type check
npm run typecheck
```

### Building for Production

```bash
# Build for iOS App Store
eas build --profile production --platform ios

# Build for Android Play Store
eas build --profile production --platform android

# Submit to stores (after build)
eas submit --platform ios
eas submit --platform android
```

---

## 8th Wall WebView Setup

### Development Server for WebView

The 8th Wall code runs in a WebView. During development:

```bash
# Start WebView dev server (separate terminal)
npm run web:dev

# This serves the /web directory on localhost:3000
```

Configure WebView URL in development:
- **Development**: `http://localhost:3000`
- **Production**: Bundled with app (loaded from assets)

### 8th Wall Project Setup

1. Create project at https://www.8thwall.com/
2. Add your app's bundle identifier (iOS) and package name (Android)
3. Copy API key to `.env`
4. Enable required features:
   - World Tracking
   - Surface Detection
   - Lighting Estimation

---

## Common Issues & Solutions

### Issue: Metro bundler fails to start

```bash
# Clear Metro cache
npx expo start --clear
```

### Issue: iOS pod install fails

```bash
cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..
```

### Issue: Android build fails

```bash
# Clean Android build
cd android
./gradlew clean
cd ..
```

### Issue: 8th Wall not loading in WebView

1. Verify API key is correct
2. Check bundle ID matches 8th Wall project
3. Ensure device has internet connection
4. Check WebView console for errors

### Issue: AR not working on device

1. Verify camera permissions granted
2. Ensure adequate lighting
3. Check device supports ARKit/ARCore
4. Restart AR session: Reset button in app

---

## Next Steps

1. **Review contracts**: Check `/contracts` for TypeScript interfaces
2. **Review data model**: See `data-model.md` for entity definitions
3. **Start implementation**: Begin with Phase 2 tasks in `tasks.md`

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [8th Wall Documentation](https://www.8thwall.com/docs/)
- [Niantic Lightship SDK](https://lightship.dev/docs/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
- [React Navigation](https://reactnavigation.org/docs/)
