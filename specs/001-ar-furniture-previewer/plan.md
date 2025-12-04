# Implementation Plan: AR Furniture Previewer

**Branch**: `001-ar-furniture-previewer` | **Date**: 2025-12-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ar-furniture-previewer/spec.md`

## Summary

AR Furniture Previewer is a cross-platform mobile application (iOS & Android) that enables users to visualize 3D furniture models in their physical space using augmented reality. The app leverages 8th Wall WebAR for AR rendering via WebView, Niantic Lightship for 3D object scanning, and React Native with Expo Bare Workflow for the native shell. Key capabilities include real-time AR furniture placement with gesture controls, photogrammetry-based 3D scanning, local model library management, and VPS-anchored scene persistence.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Primary Dependencies**: React Native 0.73+, Expo SDK 50+ (Bare Workflow), React Navigation v6, Zustand, react-native-webview, 8th Wall WebAR, Three.js, Niantic Lightship VPS/Scanning  
**Storage**: AsyncStorage for metadata, react-native-fs for GLB/thumbnail files, local file system (/Documents/ARFurniture/)  
**Testing**: Jest + React Native Testing Library (unit), Detox (E2E), visual regression via Storybook  
**Target Platform**: iOS 14+, Android 8.0+ (API 26+)  
**Project Type**: Mobile (React Native)  
**Performance Goals**: 30 FPS minimum in AR, <3s app launch, <2s model load (<10MB), <5min scan processing  
**Constraints**: <300MB memory, <500KB initial bundle (gzipped), 50MB max model size, 50 models / 20 scenes storage limit  
**Scale/Scope**: Consumer mobile app, 5 main screens, offline-capable library (AR requires internet)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| **I. Code Quality Excellence** | Single responsibility, pure functions, type annotations, <10 cyclomatic complexity | ✅ PASS | Services separated by domain (ModelStorage, SceneManager, ARBridge) |
| **TDD** | Red-Green-Refactor, tests before implementation | ✅ PASS | Test structure planned for each module |
| **SOLID** | SRP, OCP, LSP, ISP, DIP adherence | ✅ PASS | Abstract interfaces for storage, AR, scanning |
| **YAGNI** | No speculative features | ✅ PASS | Only implementing spec'd requirements |
| **DRY** | Single source of truth | ✅ PASS | Shared types, centralized config, Zustand stores |
| **II. TDD (NON-NEGOTIABLE)** | 80% coverage business logic, 100% critical paths | ✅ PASS | Jest + Detox test strategy defined |
| **III. UX Consistency** | Design system, loading states >200ms, WCAG 2.1 AA | ✅ PASS | Color palette defined, skeleton screens planned |
| **IV. Performance-First** | 30 FPS AR, <3s launch, <300MB memory | ✅ PASS | Performance budgets in success criteria |

**Gate Result**: ✅ PASS - No violations. Proceeding to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-ar-furniture-previewer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (WebView bridge API)
│   └── webview-bridge.ts
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── ScannerScreen.tsx
│   │   ├── LibraryScreen.tsx
│   │   ├── ARViewerScreen.tsx
│   │   └── SavedScenesScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── SkeletonLoader.tsx
│   │   ├── ModelCard.tsx
│   │   ├── SceneCard.tsx
│   │   ├── ScanProgressIndicator.tsx
│   │   ├── ARControls.tsx
│   │   ├── ModelPicker.tsx
│   │   └── OnboardingSlide.tsx
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   └── hooks/
│       ├── usePermissions.ts
│       ├── useARSession.ts
│       └── useModelLibrary.ts
├── core/
│   ├── services/
│   │   ├── ModelStorageService.ts
│   │   ├── SceneManagerService.ts
│   │   ├── ThumbnailService.ts
│   │   └── GLBValidatorService.ts
│   ├── stores/
│   │   ├── useModelStore.ts
│   │   ├── useSceneStore.ts
│   │   ├── useARStore.ts
│   │   └── useSettingsStore.ts
│   ├── types/
│   │   ├── model.types.ts
│   │   ├── scene.types.ts
│   │   ├── webview.types.ts
│   │   └── index.ts
│   └── constants/
│       ├── theme.ts
│       ├── limits.ts
│       └── paths.ts
├── infrastructure/
│   ├── webview/
│   │   ├── ARWebViewBridge.ts
│   │   └── messageHandlers.ts
│   ├── filesystem/
│   │   └── FileSystemAdapter.ts
│   └── permissions/
│       └── PermissionsAdapter.ts
└── assets/
    ├── models/           # 3-5 bundled GLB models
    ├── icons/
    └── fonts/

web/                      # 8th Wall web app (bundled or hosted)
├── index.html
├── ar-scene.js           # Three.js + 8th Wall integration
├── lightship-scan.js     # Scanning logic
└── bridge.js             # WebView ↔ RN communication

tests/
├── unit/
│   ├── services/
│   ├── stores/
│   └── components/
├── integration/
│   └── webview/
└── e2e/
    └── detox/

ios/                      # Generated by expo prebuild
android/                  # Generated by expo prebuild

.github/
└── workflows/
    └── eas-build.yml
```

**Structure Decision**: Mobile architecture with clear separation between app layer (UI/screens), core layer (business logic/stores), and infrastructure layer (external integrations). The web/ folder contains the 8th Wall AR experience loaded via WebView.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| 30 FPS AR (vs 60 FPS constitution) | 8th Wall WebAR runs inside WebView with Three.js rendering - WebView bridge overhead and mobile GPU constraints prevent consistent 60 FPS | Native ARKit/ARCore would achieve 60 FPS but requires platform-specific code and macOS for iOS builds; 30 FPS meets mobile AR industry standards and provides smooth UX |
