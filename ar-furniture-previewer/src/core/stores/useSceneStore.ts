/**
 * Scene Store
 * 
 * Zustand store for scene composition and management.
 * Per T025: Create useSceneStore skeleton.
 * 
 * @module core/stores/useSceneStore
 */

import { create } from 'zustand';
import type {
  SavedScene,
  PlacedObject,
  Transform,
  ScanSession,
} from '@core/types/scene.types';
import { SCENE_LIMITS } from '@core/constants/limits';

/**
 * Scene store state.
 */
interface SceneState {
  // Current scene
  currentScene: SavedScene | null;
  placedObjects: PlacedObject[];
  selectedObjectId: string | null;
  
  // Saved scenes
  savedScenes: SavedScene[];
  
  // Scan session
  scanSession: ScanSession | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  isDirty: boolean; // Has unsaved changes
}

/**
 * Scene store actions.
 */
interface SceneActions {
  // Scene management
  newScene: () => void;
  loadScene: (scene: SavedScene) => void;
  saveScene: (name: string) => SavedScene;
  deleteScene: (sceneId: string) => void;
  setSavedScenes: (scenes: SavedScene[]) => void;
  
  // Object management
  addObject: (object: PlacedObject) => void;
  updateObject: (objectId: string, updates: Partial<PlacedObject>) => void;
  updateObjectTransform: (objectId: string, transform: Transform) => void;
  removeObject: (objectId: string) => void;
  clearObjects: () => void;
  
  // Selection
  selectObject: (objectId: string | null) => void;
  
  // Scan session
  startScan: (session: ScanSession) => void;
  updateScan: (updates: Partial<ScanSession>) => void;
  endScan: () => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  markDirty: () => void;
  markClean: () => void;
  
  // Queries
  getObjectById: (id: string) => PlacedObject | undefined;
  getSceneById: (id: string) => SavedScene | undefined;
  canAddObject: () => boolean;
  canSaveScene: () => boolean;
  getObjectCount: () => number;
  getSceneCount: () => number;
  
  // Reset
  reset: () => void;
}

type SceneStore = SceneState & SceneActions;

const initialState: SceneState = {
  currentScene: null,
  placedObjects: [],
  selectedObjectId: null,
  savedScenes: [],
  scanSession: null,
  isLoading: false,
  error: null,
  isDirty: false,
};

/**
 * Generate unique ID.
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Scene store.
 */
export const useSceneStore = create<SceneStore>()((set, get) => ({
  ...initialState,

  newScene: () =>
    set({
      currentScene: null,
      placedObjects: [],
      selectedObjectId: null,
      isDirty: false,
    }),

  loadScene: (scene) =>
    set({
      currentScene: scene,
      placedObjects: scene.objects,
      selectedObjectId: null,
      isDirty: false,
    }),

  saveScene: (name) => {
    const state = get();
    const now = Date.now();
    
    const scene: SavedScene = {
      id: state.currentScene?.id ?? generateId(),
      name,
      thumbnailBase64: state.currentScene?.thumbnailBase64 ?? '',
      anchorId: state.currentScene?.anchorId ?? null,
      objects: state.placedObjects,
      createdAt: state.currentScene?.createdAt ?? now,
      updatedAt: now,
      anchorType: state.currentScene?.anchorType ?? 'DEVICE_RELATIVE',
    };
    
    set((s) => ({
      currentScene: scene,
      savedScenes: s.currentScene
        ? s.savedScenes.map((sc) => (sc.id === scene.id ? scene : sc))
        : [...s.savedScenes, scene],
      isDirty: false,
    }));
    
    return scene;
  },

  deleteScene: (sceneId) =>
    set((state) => ({
      savedScenes: state.savedScenes.filter((s) => s.id !== sceneId),
      currentScene:
        state.currentScene?.id === sceneId ? null : state.currentScene,
    })),

  setSavedScenes: (savedScenes) => set({ savedScenes }),

  addObject: (object) =>
    set((state) => ({
      placedObjects: [...state.placedObjects, object],
      isDirty: true,
    })),

  updateObject: (objectId, updates) =>
    set((state) => ({
      placedObjects: state.placedObjects.map((obj) =>
        obj.id === objectId ? { ...obj, ...updates } : obj
      ),
      isDirty: true,
    })),

  updateObjectTransform: (objectId, transform) =>
    set((state) => ({
      placedObjects: state.placedObjects.map((obj) =>
        obj.id === objectId ? { ...obj, transform } : obj
      ),
      isDirty: true,
    })),

  removeObject: (objectId) =>
    set((state) => ({
      placedObjects: state.placedObjects.filter((obj) => obj.id !== objectId),
      selectedObjectId:
        state.selectedObjectId === objectId ? null : state.selectedObjectId,
      isDirty: true,
    })),

  clearObjects: () =>
    set({
      placedObjects: [],
      selectedObjectId: null,
      isDirty: true,
    }),

  selectObject: (objectId) => set({ selectedObjectId: objectId }),

  startScan: (session) => set({ scanSession: session }),

  updateScan: (updates) =>
    set((state) => ({
      scanSession: state.scanSession
        ? { ...state.scanSession, ...updates }
        : null,
    })),

  endScan: () => set({ scanSession: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  markDirty: () => set({ isDirty: true }),

  markClean: () => set({ isDirty: false }),

  getObjectById: (id) => get().placedObjects.find((obj) => obj.id === id),

  getSceneById: (id) => get().savedScenes.find((s) => s.id === id),

  canAddObject: () =>
    get().placedObjects.length < SCENE_LIMITS.MAX_OBJECTS_PER_SCENE,

  canSaveScene: () =>
    get().savedScenes.length < SCENE_LIMITS.MAX_SCENES ||
    get().currentScene != null,

  getObjectCount: () => get().placedObjects.length,

  getSceneCount: () => get().savedScenes.length,

  reset: () => set(initialState),
}));

/**
 * Hook to get selected object.
 */
export function useSelectedObject(): PlacedObject | undefined {
  const selectedObjectId = useSceneStore((state) => state.selectedObjectId);
  const getObjectById = useSceneStore((state) => state.getObjectById);
  return selectedObjectId != null ? getObjectById(selectedObjectId) : undefined;
}

/**
 * Hook to check if scene has unsaved changes.
 */
export function useHasUnsavedChanges(): boolean {
  return useSceneStore((state) => state.isDirty);
}
