# Research: AR Furniture Previewer

**Phase**: 0 - Research  
**Date**: 2025-12-04  
**Status**: Complete

## Research Tasks

This document consolidates research findings to resolve all technical unknowns identified in the implementation plan.

---

## 1. 8th Wall WebAR Integration

### Decision
Use 8th Wall WebAR SDK loaded within a React Native WebView for cross-platform AR without native ARKit/ARCore dependencies.

### Rationale
- **Cross-platform**: Single AR codebase works on iOS and Android
- **No macOS required**: EAS Build handles iOS compilation in cloud
- **WebView bridge**: Established pattern for RN ↔ Web communication
- **Feature-rich**: Surface detection, lighting estimation, occlusion supported

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Native ARKit + ARCore | Requires platform-specific code, no macOS for ARKit development |
| ViroReact | Discontinued, no active maintenance |
| expo-three + expo-gl | Limited AR features, no surface detection |
| React Native ARCore/ARKit bridges | Fragmented ecosystem, build complexity |

### Implementation Notes
- Host 8th Wall app on CDN or bundle in app assets
- Use `postMessage` / `onMessage` for WebView bridge
- Handle WebView lifecycle (mount/unmount) to manage AR session
- Implement connection status monitoring for graceful degradation

---

## 2. Niantic Lightship Scanning API

### Decision
Use Lightship Scanning Framework for client-side 3D object reconstruction from photos.

### Rationale
- **No server upload**: Privacy-preserving, works offline after capture
- **GLB output**: Direct compatibility with Three.js and model library
- **Integrated with 8th Wall**: Same vendor, proven integration path
- **Quality controls**: Built-in validation for photo count, coverage, blur

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Polycam SDK | Requires server processing, subscription model |
| Custom photogrammetry | Enormous complexity, needs ML expertise |
| LiDAR-only scanning | Excludes non-LiDAR devices (majority of market) |
| Skip scanning feature | Loses key differentiator per spec |

### Implementation Notes
- Minimum 20 photos, optimal 25-40 for coverage
- Processing time: 2-5 minutes depending on device
- Memory management critical - may need to process in chunks
- Provide clear UX for guided capture (angles, distance, lighting)

---

## 3. React Native WebView Performance

### Decision
Use `react-native-webview` with hardware acceleration and caching optimizations.

### Rationale
- **Mature library**: 4M+ weekly downloads, active maintenance
- **Hardware acceleration**: `androidLayerType="hardware"` for GPU rendering
- **Cache support**: Reduce 8th Wall reload times
- **Bridge API**: Robust `postMessage` implementation

### Best Practices
```typescript
<WebView
  source={{ uri: AR_SCENE_URL }}
  javaScriptEnabled
  domStorageEnabled
  cacheEnabled
  cacheMode="LOAD_CACHE_ELSE_NETWORK"
  androidLayerType="hardware"
  androidHardwareAccelerationDisabled={false}
  allowsInlineMediaPlayback
  mediaPlaybackRequiresUserAction={false}
/>
```

### Performance Considerations
- Preload WebView on app start (hidden) for faster AR launch
- Use `injectedJavaScript` sparingly - prefer bridge messages
- Monitor memory via `onMemoryWarning` callback
- Implement graceful WebView crash recovery

---

## 4. Local File Storage Strategy

### Decision
Use `react-native-fs` for file operations with AsyncStorage for metadata index.

### Rationale
- **File system access**: Required for large GLB files (up to 50MB)
- **Platform paths**: Proper handling of iOS Documents vs Android internal storage
- **Scoped Storage compliance**: Android 10+ compatible
- **Separation of concerns**: Files on disk, index in AsyncStorage

### Storage Structure
```
/Documents/ARFurniture/
├── models/
│   ├── {uuid}.glb          # 3D model files
│   └── ...
├── thumbnails/
│   ├── {uuid}.jpg          # 256x256 previews
│   └── ...
├── scenes/
│   ├── {uuid}.json         # Scene configurations
│   └── ...
└── temp/
    └── scan_{timestamp}/   # In-progress scan photos
```

### Implementation Notes
- Use UUIDs for all file names to avoid conflicts
- Implement atomic writes (temp file + rename) for crash safety
- Clean up temp directory on app launch
- Validate GLB integrity before adding to index

---

## 5. Zustand State Management

### Decision
Use Zustand for lightweight, TypeScript-first state management.

### Rationale
- **Minimal boilerplate**: No actions/reducers ceremony
- **TypeScript native**: Excellent type inference
- **Persist middleware**: Built-in AsyncStorage integration
- **React 18 compatible**: Proper concurrent mode support
- **Small bundle**: ~1KB gzipped vs Redux 7KB+

### Store Architecture
```typescript
// Separate stores by domain (SRP)
useModelStore     // Model CRUD, library state
useSceneStore     // Scene persistence, current scene
useARStore        // AR session state, WebView status
useSettingsStore  // Theme, onboarding, preferences
```

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| Redux Toolkit | Overkill for app complexity, larger bundle |
| MobX | More complex mental model, class-based |
| Jotai | Similar to Zustand but less ecosystem maturity |
| React Context | Performance issues with frequent updates |

---

## 6. Expo EAS Build Configuration

### Decision
Use EAS Build free tier with defined profiles for development, preview, and production.

### Rationale
- **No macOS required**: Cloud-based iOS builds
- **Free tier sufficient**: 30 builds/month per platform
- **Integrated CI/CD**: GitHub Actions workflow support
- **OTA updates**: EAS Update for JavaScript changes

### Build Profiles
```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal"
  },
  "preview": {
    "distribution": "internal",
    "channel": "preview"
  },
  "production": {
    "distribution": "store",
    "autoIncrement": true,
    "channel": "production"
  }
}
```

### CI/CD Strategy
- `develop` branch → development profile (dev client)
- `main` branch → preview profile (internal testing)
- `v*` tags → production profile (store submission)
- Manual dispatch for ad-hoc builds

---

## 7. GLB Validation & Thumbnail Generation

### Decision
Validate GLB files using Three.js loader, generate thumbnails via offscreen rendering.

### Rationale
- **Three.js already included**: Reuse for validation and rendering
- **Client-side**: No server dependencies
- **Consistent thumbnails**: Same renderer as AR view

### Validation Checks
1. File size ≤ 50MB
2. Valid GLB/glTF header
3. Parseable by Three.js GLTFLoader
4. Reasonable vertex count (warn if > 100k)
5. Textures load without errors

### Thumbnail Generation
- Render model in hidden WebView with Three.js
- Capture canvas as base64 JPEG
- Resize to 256x256
- Store alongside model file

---

## 8. VPS Anchor Persistence (Lightship)

### Decision
Use Lightship VPS anchors with fallback to manual placement mode.

### Rationale
- **Persistent AR**: Scenes restore in mapped locations
- **Graceful fallback**: Manual mode for unmapped areas
- **No custom backend**: Lightship handles anchor storage

### Fallback Strategy
1. Attempt VPS relocalization (10s timeout)
2. If successful → restore objects at anchored positions
3. If failed → enter manual placement mode
   - Display objects floating at origin
   - User drags each to desired position
   - Prompt to save new anchor for future

### Implementation Notes
- Store both VPS anchor ID and relative transforms
- Test in various lighting conditions
- Consider time-of-day variations in VPS reliability

---

## 9. Gesture Handling in WebView

### Decision
Handle gestures in Three.js layer, not React Native.

### Rationale
- **Lower latency**: No bridge round-trip for gesture events
- **Three.js controls**: OrbitControls, TransformControls well-tested
- **Consistent behavior**: Gestures apply directly to 3D scene

### Gesture Mapping
| Gesture | Action |
|---------|--------|
| Tap | Select object / Place new object |
| One-finger drag | Move selected object horizontally |
| Pinch | Scale selected object (0.5x - 3x) |
| Two-finger rotation | Rotate selected object (360°) |
| Long press | Open context menu |

### Implementation Notes
- Use `hammer.js` or native touch events in WebView
- Send selection changes to RN via bridge for UI updates
- Debounce transform updates to reduce bridge traffic

---

## 10. Error Handling Strategy

### Decision
Centralized error handling with user-friendly messages and recovery paths.

### Error Categories

| Category | Example | Handling |
|----------|---------|----------|
| **Network** | 8th Wall load failure | Graceful degradation, retry button |
| **Storage** | Disk full | Alert before save, cleanup suggestions |
| **AR** | Tracking lost | Overlay with recovery instructions |
| **Scan** | Processing OOM | Offer lower quality retry |
| **File** | Corrupted GLB | Remove from index, show error |
| **Permission** | Camera denied | Explanation + Settings link |

### Implementation
- Global error boundary for React crashes
- WebView error handler for AR failures
- Try/catch with typed error classes
- Sentry/Crashlytics for crash reporting (future)

---

## Summary

All technical unknowns have been resolved. Key decisions:

1. **8th Wall WebAR** in WebView for cross-platform AR
2. **Lightship Scanning** for client-side 3D reconstruction
3. **react-native-webview** with performance optimizations
4. **react-native-fs + AsyncStorage** for hybrid storage
5. **Zustand** for lightweight state management
6. **EAS Build** for cloud-based iOS/Android builds
7. **Three.js** for GLB validation and thumbnails
8. **VPS anchors** with manual placement fallback
9. **WebView-side gesture handling** for responsiveness
10. **Centralized error handling** with recovery paths

Proceed to Phase 1: Design & Contracts.
