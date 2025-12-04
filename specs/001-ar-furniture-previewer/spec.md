# Feature Specification: AR Furniture Previewer

**Feature Branch**: `001-ar-furniture-previewer`  
**Created**: 2025-12-04  
**Status**: Draft  
**Input**: User description: "AR Furniture Previewer - Mobile application for AR furniture visualization with 3D object scanning capabilities"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Place Pre-loaded Furniture in AR (Priority: P1)

As a user, I want to place pre-loaded 3D furniture models in my physical space using AR so that I can visualize how furniture would look before purchasing.

**Why this priority**: This is the core value proposition of the app. Without AR placement, the app has no primary purpose. Users can immediately experience value by placing furniture from the built-in library.

**Independent Test**: Can be fully tested by launching the app, granting camera permission, selecting a furniture model from the library, and tapping to place it in the AR view. Delivers immediate visualization value.

**Acceptance Scenarios**:

1. **Given** I have granted camera permission and am viewing the AR camera feed, **When** I tap on a detected floor surface, **Then** the selected furniture model appears at that location with realistic scale
2. **Given** a furniture model is placed in AR, **When** I use pinch gesture, **Then** the model scales between 0.5x and 3x its original size
3. **Given** a furniture model is placed in AR, **When** I use one-finger drag, **Then** the model moves horizontally along the detected surface
4. **Given** a furniture model is placed in AR, **When** I use two-finger rotation gesture, **Then** the model rotates 360° around its vertical axis
5. **Given** the AR session is active, **When** I tap the model picker, **Then** I can select from available pre-loaded furniture models
6. **Given** multiple models are placed (up to 10), **When** I view the scene, **Then** all models maintain their positions and interact correctly with lighting

---

### User Story 2 - Manage Local Model Library (Priority: P2)

As a user, I want to browse, organize, and manage my furniture model library so that I can quickly find and use the models I need.

**Why this priority**: A usable library is essential for accessing models to place in AR. This provides the interface to the P1 functionality and enables organization of both pre-loaded and user-scanned models.

**Independent Test**: Can be fully tested by opening the Library tab, viewing the grid of models, using search and filter functions, and performing model management actions (rename, delete). Delivers organizational value independently.

**Acceptance Scenarios**:

1. **Given** I am on the Library screen, **When** the screen loads, **Then** I see a 3-column grid of model thumbnails with names
2. **Given** I am viewing the library, **When** I type in the search bar, **Then** models are filtered in real-time by name
3. **Given** I am viewing the library, **When** I tap a category filter chip, **Then** only models of that category are displayed
4. **Given** I am viewing the library, **When** I long-press a model, **Then** I see options to Rename, Delete, or Share
5. **Given** I tap "Import Model", **When** I select a GLB file from device storage, **Then** the model is added to my library with auto-generated thumbnail
6. **Given** I tap on a model card, **When** the info modal opens, **Then** I see file size, vertex count, creation date, and category

---

### User Story 3 - Scan Real Objects into 3D Models (Priority: P3)

As a user, I want to scan real-world objects using my phone camera and convert them into 3D models so that I can place custom furniture in AR.

**Why this priority**: This differentiates the app from basic AR viewers. While valuable, it requires more complex implementation and users can still get value from P1 and P2 without scanning.

**Independent Test**: Can be fully tested by entering Scan mode, following the guided wizard to capture at least 20 photos (25-40 recommended) of an object, waiting for processing, and viewing the resulting 3D model. Delivers custom content creation value.

**Acceptance Scenarios**:

1. **Given** I am on the Scanner screen, **When** I tap "Start Scan", **Then** I see step-by-step instructions for object preparation
2. **Given** I am in capture mode, **When** I capture a photo with good quality, **Then** I see a green checkmark and the progress counter increments
3. **Given** I am capturing, **When** I capture a blurry photo, **Then** I see a red warning indicating motion blur
4. **Given** I have captured 25+ photos, **When** I tap "Process", **Then** I see a progress indicator and estimated time (2-5 minutes)
5. **Given** processing completes successfully, **When** the result screen shows, **Then** I can preview the 3D model and save it to my library
6. **Given** I have fewer than 20 photos, **When** I try to process, **Then** I see an error message requiring more photos

---

### User Story 4 - Save and Restore AR Scenes (Priority: P4)

As a user, I want to save my AR furniture arrangements and restore them later so that I can revisit and refine my room designs.

**Why this priority**: Persistence adds significant value but depends on core AR functionality working first. Users can still use the app for one-time visualization without saving.

**Independent Test**: Can be fully tested by placing furniture in AR, saving the scene with a name, exiting, returning to Saved Scenes, and loading the scene to see furniture restored to original positions. Delivers continuity value.

**Acceptance Scenarios**:

1. **Given** I have furniture placed in AR, **When** I tap the Save button, **Then** I can enter a scene name and save with a thumbnail screenshot
2. **Given** I am on the Saved Scenes screen, **When** the screen loads, **Then** I see a list of saved scenes with thumbnails, names, dates, and object counts
3. **Given** I tap on a saved scene, **When** I am in the same physical location, **Then** the AR system relocalizes and restores all objects to their saved positions
4. **Given** I long-press a saved scene, **When** the options appear, **Then** I can delete the scene or export it as an image
5. **Given** VPS anchors are available, **When** I save a scene, **Then** the scene uses persistent anchors for reliable restoration

---

### User Story 5 - First-Time User Onboarding (Priority: P5)

As a new user, I want to understand how to use the app's features through a guided onboarding so that I can quickly start visualizing furniture.

**Why this priority**: Good onboarding improves retention but is not essential for core functionality. Power users can skip and still use the app effectively.

**Independent Test**: Can be fully tested by fresh installing the app and progressing through the onboarding screens, granting permissions, and reaching the home screen. Delivers educational value.

**Acceptance Scenarios**:

1. **Given** I launch the app for the first time, **When** the onboarding starts, **Then** I see a 3-screen tutorial explaining key features
2. **Given** I am on the camera permission screen, **When** I tap "Allow", **Then** the system permission dialog appears with a clear explanation
3. **Given** I complete onboarding, **When** I reach the home screen, **Then** I see featured models, a quick start button, and tips
4. **Given** I have completed onboarding before, **When** I launch the app again, **Then** I skip directly to the home screen

---

### Edge Cases

- What happens when camera permission is denied? → Show explanation screen with button to open Settings
- What happens when device doesn't support AR? → Display "Device Not Supported" screen with feature explanation
- What happens when lighting is poor during AR? → Show real-time toast message suggesting better lighting
- What happens when scan processing fails? → Offer retry option or save partial result if possible
- What happens when storage is full? → Alert user before saving and suggest deleting old models
- What happens when 8th Wall fails to load (no internet)? → Graceful degradation: disable AR/Scan tabs with explanatory banner, allow Library and Scenes browsing, show retry button for AR features
- What happens when user places more than 10 objects? → Disable add button with tooltip explaining limit
- What happens when model file is corrupted? → Remove from index, show error, suggest re-scan
- What happens during low battery (< 20%)? → Show warning that scanning is battery-intensive
- What happens if app is force-quit during scan processing? → On relaunch, detect incomplete scan and offer to retry

## Requirements *(mandatory)*

### Functional Requirements

#### AR Placement Core
- **FR-001**: System MUST display real-time camera feed with AR overlay via 8th Wall WebView
- **FR-002**: System MUST automatically detect horizontal surfaces (floors, tables) and vertical surfaces (walls)
- **FR-003**: Users MUST be able to tap on detected surfaces to place 3D furniture models
- **FR-004**: System MUST support gesture controls: pinch to scale (0.5x-3x), one-finger drag to move, two-finger rotation (360°)
- **FR-005**: System MUST support vertical height adjustment via slider control
- **FR-006**: System MUST allow placement of up to 10 objects per scene
- **FR-007**: System MUST render realistic lighting using environment probes
- **FR-008**: System MUST handle occlusion so objects hide behind real surfaces
- **FR-009**: System MUST render shadows on detected planes

#### 3D Object Scanning
- **FR-010**: System MUST provide a guided scanning wizard with 5 steps (preparation, capture, progress, processing, preview)
- **FR-011**: System MUST recommend 25-40 photos for complete object coverage (displayed as guidance to user)
- **FR-012**: System MUST provide visual feedback during capture (green checkmarks for good photos, red warnings for blur/poor lighting)
- **FR-013**: System MUST display a coverage map showing captured angles
- **FR-014**: System MUST generate GLB files client-side using Lightship API without server upload
- **FR-015**: System MUST enforce minimum 20 photos before allowing scan processing
- **FR-016**: System MUST auto-generate 256x256 thumbnails for scanned models
- **FR-017**: System MUST display estimated processing time (2-5 minutes)

#### Model Library
- **FR-018**: System MUST store models locally in /Documents/ARFurniture/models/ directory
- **FR-019**: System MUST display models in a 3-column grid with thumbnails
- **FR-020**: System MUST support categories: Chair, Table, Sofa, Cabinet, Lamp, Custom
- **FR-021**: System MUST provide real-time search filtering by name
- **FR-050**: App MUST bundle 3-5 pre-loaded furniture models (one per main category) optimized for mobile to enable immediate functionality demonstration
- **FR-022**: System MUST support sorting by Name, Date, Size, Category
- **FR-023**: System MUST support long-press actions: Rename, Delete, Share
- **FR-024**: System MUST support importing external GLB files via Files app (iOS) or SAF (Android)
- **FR-025**: System MUST display model info: file size, vertex count, texture resolution, creation date, last used
- **FR-046**: System MUST enforce storage limits: maximum 50 models and maximum 20 saved scenes per device
- **FR-047**: System MUST display clear messaging when storage limits are reached and prompt user to delete existing items
- **FR-049**: System MUST reject imported GLB files exceeding 50MB with clear error message explaining the size limit

#### Scene Persistence
- **FR-026**: System MUST save scene configurations including object positions, rotations, scales, and lighting
- **FR-027**: System MUST use Lightship VPS persistent anchors for scene localization when available
- **FR-028**: System MUST store scene metadata including id, name, timestamp, thumbnail, anchor ID, and objects array
- **FR-029**: System MUST provide scene list view with preview thumbnails
- **FR-030**: System MUST support scene restoration with automatic relocalization
- **FR-031**: System MUST support exporting scenes as PNG images (1920x1080)
- **FR-032**: System MUST support sharing scene configurations as JSON
- **FR-048**: System MUST provide manual placement fallback when VPS relocalization fails, displaying saved objects floating for user to position manually

#### User Interface
- **FR-033**: System MUST use bottom tab navigation with Home, Scan, Library, Scenes tabs
- **FR-034**: Home screen MUST display featured models carousel, quick start button, recent scans, and tips
- **FR-035**: AR Viewer MUST display floating controls overlay with model picker, reset view, and save buttons
- **FR-036**: System MUST use defined color palette (Primary: #6366F1, Secondary: #EC4899, Success: #10B981, Error: #EF4444)
- **FR-037**: System MUST support light and dark themes
- **FR-038**: System MUST use 4px base spacing unit and defined border radius (8px cards, 24px buttons)

#### Platform Requirements
- **FR-039**: iOS app MUST target iOS 14+ and request camera, photo library, and location permissions
- **FR-040**: Android app MUST target Android 8.0+ (API 26+) and comply with Scoped Storage
- **FR-041**: System MUST detect LiDAR-capable devices and use ARKit depth API when available
- **FR-042**: System MUST check ARCore availability on Android and show appropriate messaging

#### Build & Deployment
- **FR-043**: CI/CD MUST use GitHub Actions with ubuntu-latest runners
- **FR-044**: Builds MUST use Expo EAS Build with defined profiles (development, preview, production)
- **FR-045**: System MUST inject 8th Wall API keys via environment variables, never committed to repo

### Key Entities

- **Model**: Represents a 3D furniture model with id, name, glbPath, thumbnailPath, category, and metadata (fileSize, vertexCount, dateCreated)
- **SavedScene**: Represents a saved AR arrangement with id, name, timestamp, thumbnail, anchorId, and array of placed objects with transforms
- **Transform**: Represents 3D transformation with position (x,y,z), rotation (quaternion), and scale (x,y,z)
- **ModelCategory**: Enumeration of furniture types (Chair, Table, Sofa, Cabinet, Lamp, Custom)
- **ScanSession**: Represents an active scanning session with photos array, coverage map, and processing state

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can place their first furniture model within 60 seconds of launching the app
- **SC-002**: AR surface detection succeeds within 5 seconds on supported devices in adequate lighting
- **SC-003**: 3D model scanning completes successfully for 85% of attempted scans with proper technique
- **SC-004**: App maintains minimum 30 FPS during AR sessions on mid-range devices
- **SC-005**: Model loading completes within 2 seconds for files under 10MB
- **SC-006**: App launches to home screen within 3 seconds
- **SC-007**: Scan processing completes within 5 minutes on supported devices
- **SC-008**: Saved scenes restore within 10 seconds when user is in the correct location
- **SC-009**: App achieves crash-free rate above 99%
- **SC-010**: Memory usage stays below 300MB during normal operation
- **SC-011**: Initial bundle size stays below 500KB gzipped (code-split)
- **SC-012**: 90% of first-time users complete onboarding and reach the home screen

## Assumptions

- Users have devices that support ARCore (Android) or are using 8th Wall's WebAR fallback
- 8th Wall Standard plan ($99/month) provides sufficient API limits (10k scans/month)
- Lightship Scanning API can generate usable GLB files client-side within memory constraints
- Users have adequate lighting conditions for AR and scanning features
- Internet connectivity is available for 8th Wall initialization (offline mode not supported for AR)
- EAS Build free tier (30 builds/month per platform) is sufficient for development workflow
- React Native WebView provides sufficient performance for Three.js rendering
- Users understand basic AR concepts (pointing at surfaces, gestures for manipulation)

## Clarifications

### Session 2025-12-04

- Q: What is the storage quota strategy for models and scenes? → A: Hard limit per category (max 50 models, max 20 scenes)
- Q: What is the fallback behavior when 8th Wall service is unavailable? → A: Graceful degradation - disable AR/scan but allow library browsing and scene management
- Q: What happens when restoring a scene in unmapped/different location? → A: Manual placement mode - show scene objects floating, user positions them manually
- Q: What is the maximum allowed file size for imported GLB models? → A: 50MB max for balance between detail and stability
- Q: How many pre-loaded models should be bundled with the app? → A: Minimal (3-5 models) to demo functionality and keep app small
