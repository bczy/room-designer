# Tasks: AR Furniture Previewer

**Input**: Design documents from `/specs/001-ar-furniture-previewer/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and React Native + Expo bare workflow setup

- [X] T001 Create project structure with Expo bare workflow: `yarn create expo-app ar-furniture-previewer --template bare-minimum` (FR-051: Yarn required)
- [X] T002 Configure TypeScript strict mode in tsconfig.json
- [X] T003 [P] Install core dependencies: react-navigation, zustand, react-native-webview, react-native-fs
- [X] T004 [P] Configure ESLint + Prettier with React Native rules in .eslintrc.js and .prettierrc
- [X] T005 [P] Create directory structure per plan.md: src/app/, src/core/, src/infrastructure/, web/, tests/
- [X] T006 [P] Configure Jest with React Native Testing Library in jest.config.js
- [X] T007 [P] Configure Detox for E2E testing in detox.config.js
- [X] T008 Create EAS Build configuration in eas.json (development, preview, production profiles)
- [X] T009 [P] Configure environment variables for 8th Wall API key in app.config.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Type Definitions

- [ ] T010 [P] Create core types in src/core/types/model.types.ts per data-model.md (Model, ModelMetadata, ModelCategory, BoundingBox)
- [ ] T011 [P] Create scene types in src/core/types/scene.types.ts per data-model.md (SavedScene, PlacedObject, Transform, AnchorType)
- [ ] T012 [P] Create WebView bridge types in src/core/types/webview.types.ts per contracts/webview-bridge.ts
- [ ] T013 [P] Create index barrel export in src/core/types/index.ts

### Constants & Configuration

- [ ] T014 [P] Define theme constants in src/core/constants/theme.ts (colors, spacing, typography per FR-036/FR-038)
- [ ] T015 [P] Define storage limits in src/core/constants/limits.ts (50 models, 20 scenes, 10 objects, 50MB per FR-046)
- [ ] T016 [P] Define file paths in src/core/constants/paths.ts (/Documents/ARFurniture/ structure per research.md)

### Storage Infrastructure

- [ ] T017 Implement FileSystemAdapter in src/infrastructure/filesystem/FileSystemAdapter.ts (react-native-fs wrapper)
- [ ] T018 Implement storage key constants and AsyncStorage helpers in src/infrastructure/storage/asyncStorageHelpers.ts

### WebView Bridge (Core - No 8th Wall yet)

- [ ] T019 Create WebViewBridge class in src/infrastructure/webview/ARWebViewBridge.ts implementing bridge contract (postMessage/onMessage)
- [ ] T020 Create message handler registry in src/infrastructure/webview/messageHandlers.ts

### Navigation Shell

- [ ] T021 Configure React Navigation with bottom tabs in src/app/navigation/RootNavigator.tsx (Home, Scan, Library, Scenes per FR-033)
- [ ] T022 [P] Create placeholder screen components: HomeScreen.tsx, ScannerScreen.tsx, LibraryScreen.tsx, ARViewerScreen.tsx, SavedScenesScreen.tsx in src/app/screens/

### Zustand Store Setup

- [ ] T023 [P] Create useSettingsStore in src/core/stores/useSettingsStore.ts (theme, onboarding state per AppSettings)
- [ ] T024 [P] Create useModelStore skeleton in src/core/stores/useModelStore.ts (model CRUD state)
- [ ] T025 [P] Create useSceneStore skeleton in src/core/stores/useSceneStore.ts (scene persistence state)
- [ ] T026 [P] Create useARStore skeleton in src/core/stores/useARStore.ts (AR session state)

### Permissions

- [ ] T027 Implement PermissionsAdapter in src/infrastructure/permissions/PermissionsAdapter.ts (camera, photo library)
- [ ] T028 Create usePermissions hook in src/app/hooks/usePermissions.ts

### Common UI Components

- [ ] T029 [P] Create Button component in src/app/components/common/Button.tsx (primary, secondary, disabled states)
- [ ] T030 [P] Create Card component in src/app/components/common/Card.tsx (elevation, border radius per theme)
- [ ] T031 [P] Create Modal component in src/app/components/common/Modal.tsx (slide-up sheet)
- [ ] T032 [P] Create SkeletonLoader component in src/app/components/common/SkeletonLoader.tsx (loading states >200ms)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Place Pre-loaded Furniture in AR (Priority: P1) 🎯 MVP

**Goal**: Users can place pre-loaded 3D furniture models in AR and manipulate them with gestures

**Independent Test**: Launch app → grant camera → select model from library → tap to place in AR → pinch/drag/rotate model

### Tests for User Story 1 (TDD - Write FIRST, must FAIL before implementation)

- [ ] T033 [P] [US1] Unit tests for ModelStorageService in tests/unit/services/ModelStorageService.test.ts (getAllModels, getModel, canAddModel)
- [ ] T034 [P] [US1] Unit tests for BundledAssetsService in tests/unit/services/BundledAssetsService.test.ts (copy bundled files)
- [ ] T035 [P] [US1] Unit tests for ARService in tests/unit/services/ARService.test.ts (initialize, placeModel, updateTransform)
- [ ] T036 [P] [US1] Integration tests for WebView bridge in tests/integration/webview/ARWebViewBridge.test.ts
- [ ] T037 [P] [US1] Component tests for ARControls in tests/unit/components/ARControls.test.tsx
- [ ] T038 [US1] E2E test for AR placement flow in tests/e2e/detox/arPlacement.test.ts

### Storage Services for US1

- [ ] T039 [US1] Implement ModelStorageService in src/core/services/ModelStorageService.ts (getAllModels, getModel, canAddModel per storage-service.ts)
- [ ] T040 [US1] Implement BundledAssetsService in src/core/services/BundledAssetsService.ts (copy bundled GLB files on first launch per FR-050)
- [ ] T041 [US1] Wire ModelStorageService into useModelStore in src/core/stores/useModelStore.ts

### 8th Wall WebView AR Engine

- [ ] T042 [US1] Create 8th Wall web app entry point in web/index.html (load 8th Wall SDK)
- [ ] T043 [US1] Implement Three.js AR scene in web/ar-scene.js (surface detection, model loading, rendering)
- [ ] T044 [US1] Implement WebView bridge client in web/bridge.js (message handling for RN communication)
- [ ] T045 [US1] Add gesture handlers in web/ar-scene.js (tap to place, pinch to scale 0.5x-3x, drag to move, rotation per FR-004)
- [ ] T046 [US1] Implement lighting estimation and shadows in web/ar-scene.js (FR-007, FR-009)
- [ ] T047 [US1] Implement occlusion handling in web/ar-scene.js (objects hide behind real surfaces per FR-008)

### AR Service Implementation

- [ ] T048 [US1] Implement ARService in src/core/services/ARService.ts wrapping WebViewBridge (initialize, placeModel, updateTransform per ar-service.ts)
- [ ] T049 [US1] Create useARSession hook in src/app/hooks/useARSession.ts (session lifecycle, state sync)
- [ ] T050 [US1] Wire ARService into useARStore in src/core/stores/useARStore.ts

### AR Viewer Screen

- [ ] T051 [US1] Implement ARViewerScreen in src/app/screens/ARViewerScreen.tsx (WebView container, fullscreen camera)
- [ ] T052 [US1] Create ARControls overlay in src/app/components/ARControls.tsx (model picker, reset, save buttons per FR-035)
- [ ] T053 [US1] Create ModelPicker bottom sheet in src/app/components/ModelPicker.tsx (horizontal scroll of model thumbnails)
- [ ] T054 [US1] Add height adjustment slider to ARControls per FR-005
- [ ] T055 [US1] Implement object count limit (10 max) with disabled add button per FR-006

### Home Screen for US1

- [ ] T056 [US1] Implement HomeScreen in src/app/screens/HomeScreen.tsx (featured models carousel, quick start button per FR-034)
- [ ] T057 [US1] Create ModelCard component in src/app/components/ModelCard.tsx (thumbnail, name, category)

### Bundled Models

- [ ] T058 [US1] Add 3-5 bundled GLB models to assets/models/ (chair, table, sofa, lamp, cabinet per FR-050)
- [ ] T059 [US1] Generate thumbnails for bundled models in assets/models/thumbnails/

### Platform Detection & Error Handling for US1

- [ ] T060 [US1] Implement LiDAR detection and ARKit depth API enablement in src/infrastructure/ar/LiDARDetector.ts per FR-041
- [ ] T061 [US1] Implement ARCore availability check with user messaging in src/infrastructure/ar/ARCoreChecker.ts per FR-042
- [ ] T062 [US1] Implement camera permission denied screen in src/app/screens/PermissionDeniedScreen.tsx (Settings link)
- [ ] T063 [US1] Implement AR not supported screen in src/app/screens/ARNotSupportedScreen.tsx
- [ ] T064 [US1] Add 8th Wall offline fallback banner in ARViewerScreen (disable AR, show retry per FR-047 clarification)

**Checkpoint**: User Story 1 complete - users can place and manipulate furniture in AR with pre-loaded models

---

## Phase 4: User Story 2 - Manage Local Model Library (Priority: P2)

**Goal**: Users can browse, search, filter, and manage their furniture model library

**Independent Test**: Open Library tab → view grid of models → search by name → filter by category → long-press to rename/delete

### Tests for User Story 2 (TDD - Write FIRST, must FAIL before implementation)

- [ ] T065 [P] [US2] Unit tests for GLBValidatorService in tests/unit/services/GLBValidatorService.test.ts
- [ ] T066 [P] [US2] Unit tests for ThumbnailService in tests/unit/services/ThumbnailService.test.ts
- [ ] T067 [P] [US2] Unit tests for ModelStorageService extensions in tests/unit/services/ModelStorageService.test.ts (updateModel, deleteModel, importModel)
- [ ] T068 [P] [US2] Component tests for LibraryScreen in tests/unit/components/LibraryScreen.test.tsx
- [ ] T069 [US2] E2E test for library management flow in tests/e2e/detox/libraryManagement.test.ts

### Library Storage Extensions

- [ ] T070 [US2] Extend ModelStorageService with updateModel, deleteModel in src/core/services/ModelStorageService.ts
- [ ] T071 [US2] Implement GLBValidatorService in src/core/services/GLBValidatorService.ts (validate GLB, extract metadata per research.md)
- [ ] T072 [US2] Implement ThumbnailService in src/core/services/ThumbnailService.ts (generate 256x256 JPEG from GLB per FR-016)
- [ ] T073 [US2] Extend ModelStorageService with importModel in src/core/services/ModelStorageService.ts (validate, generate thumbnail, add to index per FR-024)

### Library Screen

- [ ] T074 [US2] Implement LibraryScreen in src/app/screens/LibraryScreen.tsx (3-column grid per FR-019)
- [ ] T075 [US2] Add search bar with real-time filtering in LibraryScreen per FR-021
- [ ] T076 [US2] Add category filter chips in LibraryScreen per FR-020 (Chair, Table, Sofa, Cabinet, Lamp, Custom)
- [ ] T077 [US2] Add sort picker (Name, Date, Size, Category) in LibraryScreen per FR-022
- [ ] T078 [US2] Implement long-press context menu (Rename, Delete, Share) per FR-023
- [ ] T079 [US2] Create model info modal showing file size, vertex count, dates per FR-025

### Model Import Flow

- [ ] T080 [US2] Implement import button in LibraryScreen triggering file picker (iOS Files, Android SAF)
- [ ] T081 [US2] Add import progress indicator and validation feedback
- [ ] T082 [US2] Implement 50MB file size rejection with error message per FR-049

### Storage Limit Handling

- [ ] T083 [US2] Add storage limit check before import (50 models max per FR-046)
- [ ] T084 [US2] Display quota warning dialog when limit reached per FR-047

### Create useModelLibrary hook

- [ ] T085 [US2] Create useModelLibrary hook in src/app/hooks/useModelLibrary.ts (search, filter, sort logic)

**Checkpoint**: User Story 2 complete - users can fully manage their model library

---

## Phase 5: User Story 3 - Scan Real Objects into 3D Models (Priority: P3)

**Goal**: Users can scan real-world objects and convert them into usable 3D models

**Independent Test**: Enter Scan mode → follow wizard → capture 20+ photos (25-40 recommended) → wait for processing → view and save resulting model

### Tests for User Story 3 (TDD - Write FIRST, must FAIL before implementation)

- [ ] T086 [P] [US3] Unit tests for ARService scanning methods in tests/unit/services/ARService.scan.test.ts
- [ ] T087 [P] [US3] Component tests for ScannerScreen in tests/unit/components/ScannerScreen.test.tsx
- [ ] T088 [P] [US3] Component tests for ScanProgressIndicator in tests/unit/components/ScanProgressIndicator.test.tsx
- [ ] T089 [US3] E2E test for scanning flow in tests/e2e/detox/scanning.test.ts

### Scanning Infrastructure

- [ ] T090 [US3] Implement Lightship scanning integration in web/lightship-scan.js (photo capture, coverage tracking)
- [ ] T091 [US3] Add scan bridge messages in web/bridge.js (START_SCAN, CAPTURE_PHOTO, END_SCAN, SCAN_PROGRESS, SCAN_COMPLETE)
- [ ] T092 [US3] Extend ARService with scanning methods in src/core/services/ARService.ts (startScan, capturePhoto, endScan per ar-service.ts)

### Scanner Screen

- [ ] T093 [US3] Implement ScannerScreen in src/app/screens/ScannerScreen.tsx (step-by-step wizard per FR-010)
- [ ] T094 [US3] Create ScanProgressIndicator in src/app/components/ScanProgressIndicator.tsx (photo count, coverage map per FR-013)
- [ ] T095 [US3] Implement capture feedback (green checkmark good, red warning blur/dark per FR-012)
- [ ] T096 [US3] Add minimum photo validation (enforce 20 photo minimum per FR-015, display 25-40 recommendation per FR-011)
- [ ] T097 [US3] Implement coverage map visualization showing captured angles per FR-013
- [ ] T098 [US3] Add processing screen with progress indicator and estimated time (2-5 min per FR-017)

### Scan Result Handling

- [ ] T099 [US3] Create scan result preview screen (3D model viewer, save/discard actions)
- [ ] T100 [US3] Extend ModelStorageService with saveScannedModel (save GLB + generate thumbnail per storage-service.ts)
- [ ] T101 [US3] Add model naming dialog before save

### Scan Error Handling

- [ ] T102 [US3] Implement scan failure recovery (retry option per edge case)
- [ ] T103 [US3] Add low battery warning (< 20% per edge case)
- [ ] T104 [US3] Handle app force-quit during processing (detect incomplete scan on relaunch per edge case)

**Checkpoint**: User Story 3 complete - users can scan real objects into 3D models

---

## Phase 6: User Story 4 - Save and Restore AR Scenes (Priority: P4)

**Goal**: Users can save AR furniture arrangements and restore them later

**Independent Test**: Place furniture in AR → save scene with name → exit → open Saved Scenes → load scene → see furniture restored

### Tests for User Story 4 (TDD - Write FIRST, must FAIL before implementation)

- [ ] T105 [P] [US4] Unit tests for SceneManagerService in tests/unit/services/SceneManagerService.test.ts
- [ ] T106 [P] [US4] Unit tests for ARService scene methods in tests/unit/services/ARService.scene.test.ts
- [ ] T107 [P] [US4] Component tests for SavedScenesScreen in tests/unit/components/SavedScenesScreen.test.tsx
- [ ] T108 [US4] E2E test for scene save/restore flow in tests/e2e/detox/scenePersistence.test.ts

### Scene Storage

- [ ] T109 [US4] Implement SceneManagerService in src/core/services/SceneManagerService.ts (saveScene, getAllScenes, getScene, deleteScene per storage-service.ts)
- [ ] T110 [US4] Wire SceneManagerService into useSceneStore in src/core/stores/useSceneStore.ts

### Scene Capture

- [ ] T111 [US4] Extend ARService with captureScene in src/core/services/ARService.ts (capture objects, screenshot, VPS anchor per ar-service.ts)
- [ ] T112 [US4] Add save button flow in ARControls (capture → name input → save confirmation per FR-026)
- [ ] T113 [US4] Implement scene thumbnail generation (screenshot capture per FR-026)

### Saved Scenes Screen

- [ ] T114 [US4] Implement SavedScenesScreen in src/app/screens/SavedScenesScreen.tsx (list view with thumbnails per FR-029)
- [ ] T115 [US4] Create SceneCard component in src/app/components/SceneCard.tsx (thumbnail, name, date, object count)
- [ ] T116 [US4] Implement long-press context menu (Delete, Export as PNG 1920x1080 per FR-031)
- [ ] T117 [US4] Implement scene JSON export for sharing per FR-032

### Scene Restoration

- [ ] T118 [US4] Extend ARService with restoreScene in src/core/services/ARService.ts per ar-service.ts
- [ ] T119 [US4] Implement VPS relocalization with 10s timeout in web/ar-scene.js per FR-027
- [ ] T120 [US4] Implement manual placement fallback mode (show floating objects for user positioning per FR-048)

### Scene Limit Handling

- [ ] T121 [US4] Add scene limit check before save (20 scenes max per FR-046)
- [ ] T122 [US4] Display quota warning dialog when limit reached per FR-047

**Checkpoint**: User Story 4 complete - users can save and restore AR scenes

---

## Phase 7: User Story 5 - First-Time User Onboarding (Priority: P5)

**Goal**: New users understand how to use the app through guided onboarding

**Independent Test**: Fresh install → see 3-screen tutorial → grant permissions → reach home screen → subsequent launches skip onboarding

### Tests for User Story 5 (TDD - Write FIRST, must FAIL before implementation)

- [ ] T123 [P] [US5] Component tests for OnboardingScreen in tests/unit/components/OnboardingScreen.test.tsx
- [ ] T124 [P] [US5] Unit tests for onboarding state in tests/unit/stores/useSettingsStore.test.ts
- [ ] T125 [US5] E2E test for onboarding flow in tests/e2e/detox/onboarding.test.ts

### Onboarding Flow

- [ ] T126 [US5] Create OnboardingScreen in src/app/screens/OnboardingScreen.tsx (3-screen swiper per FR-033 acceptance)
- [ ] T127 [US5] Create OnboardingSlide component in src/app/components/OnboardingSlide.tsx (image, title, description)
- [ ] T128 [US5] Design onboarding content (AR placement, Library, Scanning features)
- [ ] T129 [US5] Add permission request screen with explanation text per onboarding acceptance

### Onboarding State

- [ ] T130 [US5] Implement onboarding completion tracking in useSettingsStore (completeOnboarding, isOnboardingComplete per settings-service.ts)
- [ ] T131 [US5] Add conditional navigation in RootNavigator (show onboarding on first launch, skip after per acceptance)

### Home Screen Enhancements

- [ ] T132 [US5] Add tips section to HomeScreen for first-time users per FR-034
- [ ] T133 [US5] Add recent scans section to HomeScreen per FR-034

**Checkpoint**: User Story 5 complete - new users receive guided onboarding

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Theme & Accessibility

- [ ] T134 [P] Implement dark/light theme switching in useSettingsStore and theme provider per FR-037
- [ ] T135 [P] Ensure WCAG 2.1 AA contrast ratios in theme.ts colors
- [ ] T136 [P] Add accessibility labels to all interactive components

### Performance Optimization

- [ ] T137 [P] Implement WebView preloading on app start for faster AR launch per research.md
- [ ] T138 [P] Add model loading progress indicators for files > 5MB
- [ ] T139 [P] Implement memory warning handling (release cached models per edge case)

### Error Handling & Edge Cases

- [ ] T140 [P] Implement poor lighting toast in AR view per edge case
- [ ] T141 [P] Implement corrupted model file recovery (remove from index, show error per edge case)
- [ ] T142 [P] Add storage full warning before operations per edge case

### CI/CD Setup

- [ ] T143 [P] Create GitHub Actions workflow in .github/workflows/eas-build.yml per FR-043/FR-044
- [ ] T144 [P] Configure EAS secrets for 8th Wall API key (never in repo per FR-045)

### Documentation

- [ ] T145 [P] Update quickstart.md with actual setup commands
- [ ] T146 Run quickstart.md validation (fresh clone → setup → run)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - **BLOCKS all user stories**
- **Phases 3-7 (User Stories)**: All depend on Phase 2 completion
  - User stories can proceed in parallel (if team capacity allows)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Phase 8 (Polish)**: Can start after Phase 3 (US1) is complete

### User Story Dependencies

| Story | Depends On | Notes |
|-------|------------|-------|
| US1 (AR Placement) | Phase 2 only | Core MVP - no other story deps |
| US2 (Library) | Phase 2 only | Can run parallel to US1 |
| US3 (Scanning) | Phase 2, some US1 AR components | Shares 8th Wall WebView |
| US4 (Scenes) | Phase 2, US1 AR components | Needs AR placement working |
| US5 (Onboarding) | Phase 2 only | Can run parallel to US1 |

### Within Each User Story

1. Storage services before UI components
2. Core AR/service implementations before screens
3. Main functionality before error handling
4. Story complete → validate independently → move to next

### Parallel Opportunities

```text
Phase 1 (all tasks are parallelizable within phase):
  T003 ‖ T004 ‖ T005 ‖ T006 ‖ T007 ‖ T009

Phase 2 (types and constants are parallelizable):
  T010 ‖ T011 ‖ T012 ‖ T013
  T014 ‖ T015 ‖ T016
  T023 ‖ T024 ‖ T025 ‖ T026
  T029 ‖ T030 ‖ T031 ‖ T032

After Phase 2 completes (user stories can run in parallel):
  US1 (Developer A) ‖ US2 (Developer B) ‖ US5 (Developer C)
  US3 (starts after US1 AR components ready)
  US4 (starts after US1 AR components ready)

Phase 8 (all tasks marked [P] are parallelizable):
  T134 ‖ T135 ‖ T136 ‖ T137 ‖ T138 ‖ T139 ‖ T140 ‖ T141 ‖ T142 ‖ T143 ‖ T144 ‖ T145
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. ✅ Complete Phase 1: Setup
2. ✅ Complete Phase 2: Foundational
3. ✅ Complete Phase 3: User Story 1 (AR Placement)
4. **STOP and VALIDATE**: Test AR placement independently
5. Demo/deploy MVP with pre-loaded models + AR placement

### Incremental Delivery

| Milestone | Stories Included | Key Value |
|-----------|------------------|-----------|
| MVP | US1 | AR furniture placement works |
| v0.2 | + US2 | Library management + import |
| v0.3 | + US3 | 3D scanning capability |
| v0.4 | + US4 | Scene persistence |
| v1.0 | + US5 + Polish | Full featured release |

### Estimated Task Counts

| Phase | Tasks | Parallelizable |
|-------|-------|----------------|
| Setup | 9 | 7 |
| Foundational | 23 | 16 |
| US1 (P1) | 32 | 7 |
| US2 (P2) | 21 | 5 |
| US3 (P3) | 19 | 4 |
| US4 (P4) | 18 | 4 |
| US5 (P5) | 11 | 3 |
| Polish | 13 | 12 |
| **Total** | **146** | **58** |

---

## Notes

- Tasks marked [P] can run in parallel (different files, no dependencies)
- [US#] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- 8th Wall API key must be configured via environment variables (never committed)
- Test on physical devices for AR functionality (simulators limited)
