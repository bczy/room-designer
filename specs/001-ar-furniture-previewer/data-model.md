# Data Model: AR Furniture Previewer

**Phase**: 1 - Design  
**Date**: 2025-12-04  
**Status**: Complete

## Entity Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Model    │────<│ SavedScene  │>────│PlacedObject │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ModelMetadata│     │  VPSAnchor  │
└─────────────┘     └─────────────┘
```

---

## Core Entities

### Model

Represents a 3D furniture model in the user's library.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | `string` | UUID, primary key | Unique identifier |
| name | `string` | 1-100 chars, required | Display name |
| glbPath | `string` | Valid file path, required | Path to GLB file |
| thumbnailPath | `string` | Valid file path, required | Path to 256x256 JPEG |
| category | `ModelCategory` | Enum, required | Furniture category |
| isBundled | `boolean` | Required | True for pre-loaded models |
| metadata | `ModelMetadata` | Required | Technical metadata |
| createdAt | `number` | Unix timestamp, required | Creation date |
| lastUsedAt | `number \| null` | Unix timestamp | Last AR placement |

**Validation Rules**:
- `name` must be unique within library
- `glbPath` file must exist and be ≤ 50MB
- `thumbnailPath` file must exist and be valid JPEG
- `isBundled` models cannot be deleted

---

### ModelMetadata

Technical metadata extracted from GLB file.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| fileSize | `number` | > 0, ≤ 52428800 (50MB) | Size in bytes |
| vertexCount | `number` | > 0 | Total vertices |
| textureResolution | `string \| null` | Format: "WxH" | Largest texture dims |
| hasAnimations | `boolean` | Required | Contains animations |
| boundingBox | `BoundingBox` | Required | Model dimensions |

---

### ModelCategory

Enumeration of furniture categories.

| Value | Description |
|-------|-------------|
| `CHAIR` | Chairs, stools, seating |
| `TABLE` | Tables, desks, surfaces |
| `SOFA` | Sofas, couches, loveseats |
| `CABINET` | Cabinets, shelves, storage |
| `LAMP` | Lamps, lighting fixtures |
| `CUSTOM` | User-scanned objects |

---

### SavedScene

Represents a saved AR scene configuration.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | `string` | UUID, primary key | Unique identifier |
| name | `string` | 1-100 chars, required | Display name |
| thumbnailBase64 | `string` | Valid base64 JPEG | Scene screenshot |
| anchorId | `string \| null` | VPS anchor ID | Lightship VPS anchor |
| anchorType | `AnchorType` | Enum, required | Anchor strategy used |
| objects | `PlacedObject[]` | Max 10 items | Placed furniture |
| createdAt | `number` | Unix timestamp, required | Creation date |
| updatedAt | `number` | Unix timestamp, required | Last modification |

**Validation Rules**:
- `name` must be unique within saved scenes
- `objects.length` must be ≤ 10
- `thumbnailBase64` must be valid JPEG < 500KB

---

### AnchorType

Enumeration of scene anchor strategies.

| Value | Description |
|-------|-------------|
| `VPS` | Lightship VPS persistent anchor |
| `DEVICE_RELATIVE` | Relative to device at save time |
| `MANUAL` | User positions manually on restore |

---

### PlacedObject

Represents a furniture model placed in a scene.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | `string` | UUID, required | Instance identifier |
| modelId | `string` | Valid Model.id, required | Reference to model |
| transform | `Transform` | Required | Position, rotation, scale |
| placedAt | `number` | Unix timestamp, required | When placed |

---

### Transform

3D transformation data for placed objects.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| position | `[number, number, number]` | Required | X, Y, Z coordinates |
| rotation | `[number, number, number, number]` | Valid quaternion | W, X, Y, Z rotation |
| scale | `[number, number, number]` | 0.5-3.0 per axis | X, Y, Z scale factors |

**Validation Rules**:
- Quaternion must be normalized (magnitude ≈ 1)
- Scale values must be within 0.5 to 3.0

---

### BoundingBox

Axis-aligned bounding box for model dimensions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| min | `[number, number, number]` | Required | Minimum corner |
| max | `[number, number, number]` | Required | Maximum corner |
| center | `[number, number, number]` | Required | Center point |
| size | `[number, number, number]` | > 0 | Width, height, depth |

---

### ScanSession

Represents an active 3D scanning session (transient, not persisted).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | `string` | UUID, required | Session identifier |
| photos | `CapturedPhoto[]` | 0-40 items | Captured images |
| coverageMap | `CoverageMap` | Required | Angle coverage data |
| status | `ScanStatus` | Enum, required | Current state |
| startedAt | `number` | Unix timestamp, required | Session start |
| error | `ScanError \| null` | Error details if failed |

---

### CapturedPhoto

Individual photo in a scan session.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | `string` | UUID, required | Photo identifier |
| path | `string` | Temp file path | Path to image file |
| angle | `number` | 0-360 degrees | Capture angle |
| quality | `PhotoQuality` | Enum, required | Quality assessment |
| timestamp | `number` | Unix timestamp | Capture time |

---

### PhotoQuality

Quality assessment for captured photo.

| Value | Description |
|-------|-------------|
| `GOOD` | Usable for reconstruction |
| `BLUR` | Motion blur detected |
| `DARK` | Insufficient lighting |
| `OVEREXPOSED` | Too bright |

---

### ScanStatus

Scan session state machine.

| Value | Description |
|-------|-------------|
| `PREPARING` | Showing instructions |
| `CAPTURING` | Actively taking photos |
| `PROCESSING` | Generating 3D model |
| `COMPLETE` | Model ready |
| `FAILED` | Error occurred |
| `CANCELLED` | User cancelled |

---

### ScanError

Error details for failed scans.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| code | `ScanErrorCode` | Enum, required | Error type |
| message | `string` | Required | User-friendly message |
| recoverable | `boolean` | Required | Can retry? |

---

### CoverageMap

Tracking of scan angle coverage.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| segments | `CoverageSegment[]` | 8-12 segments | Angular regions |
| completeness | `number` | 0-100 | Overall coverage % |

---

## Storage Index Schema

### ModelIndex (AsyncStorage: `@ar_furniture/model_index`)

```typescript
interface ModelIndex {
  version: number;           // Schema version for migrations
  models: Model[];           // All models in library
  lastUpdated: number;       // Timestamp of last change
}
```

### SceneIndex (AsyncStorage: `@ar_furniture/scene_index`)

```typescript
interface SceneIndex {
  version: number;           // Schema version for migrations
  scenes: SavedScene[];      // All saved scenes
  lastUpdated: number;       // Timestamp of last change
}
```

### AppSettings (AsyncStorage: `@ar_furniture/settings`)

```typescript
interface AppSettings {
  version: number;           // Schema version
  theme: 'light' | 'dark' | 'system';
  onboardingComplete: boolean;
  lastARSession: number | null;
  analyticsEnabled: boolean;
}
```

---

## State Transitions

### Model Lifecycle

```
┌──────────┐    import/     ┌──────────┐    delete    ┌──────────┐
│  (none)  │ ───────────> │  STORED  │ ──────────> │ DELETED  │
└──────────┘    scan        └──────────┘             └──────────┘
                                  │
                                  │ select
                                  ▼
                            ┌──────────┐
                            │  IN_USE  │ (in current scene)
                            └──────────┘
```

### Scene Lifecycle

```
┌──────────┐    create    ┌──────────┐    save      ┌──────────┐
│  (none)  │ ──────────> │  DRAFT   │ ──────────> │  SAVED   │
└──────────┘              └──────────┘             └──────────┘
                                                        │
                               ┌────────────────────────┤
                               │ restore                │ delete
                               ▼                        ▼
                         ┌──────────┐            ┌──────────┐
                         │ RESTORED │            │ DELETED  │
                         └──────────┘            └──────────┘
```

### Scan Session Lifecycle

```
┌───────────┐   start   ┌───────────┐  capture  ┌───────────┐
│ PREPARING │ ───────> │ CAPTURING │ ───────> │ CAPTURING │
└───────────┘           └───────────┘   (loop) └───────────┘
                              │                      │
                              │ cancel               │ ≥20 photos
                              ▼                      ▼
                        ┌───────────┐         ┌───────────┐
                        │ CANCELLED │         │PROCESSING │
                        └───────────┘         └───────────┘
                                                    │
                              ┌──────────────────────┤
                              │ success              │ error
                              ▼                      ▼
                        ┌───────────┐         ┌───────────┐
                        │ COMPLETE  │         │  FAILED   │
                        └───────────┘         └───────────┘
```

---

## Limits & Constraints

| Entity | Limit | Enforcement |
|--------|-------|-------------|
| Models in library | 50 max | Block import/save at limit |
| Saved scenes | 20 max | Block save at limit |
| Objects per scene | 10 max | Disable add button |
| Model file size | 50 MB | Reject on import |
| Thumbnail size | 500 KB | Compress on generation |
| Scan photos | 40 max | Stop capture at limit |
| Model name length | 100 chars | Truncate on input |
| Scene name length | 100 chars | Truncate on input |
