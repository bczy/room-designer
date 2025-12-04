/**
 * Model Store
 * 
 * Zustand store for model library state.
 * Per T024: Create useModelStore skeleton.
 * 
 * @module core/stores/useModelStore
 */

import { create } from 'zustand';
import type {
  Model,
  ModelCategory,
  ModelFilter,
  ModelSortField,
  SortDirection,
} from '@core/types/model.types';
import { MODEL_LIMITS } from '@core/constants/limits';

/**
 * Model store state.
 */
interface ModelState {
  // Data
  models: Model[];
  
  // UI State
  selectedModelId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Filter & Sort
  filter: ModelFilter;
  sortField: ModelSortField;
  sortDirection: SortDirection;
}

/**
 * Model store actions.
 */
interface ModelActions {
  // CRUD Operations
  setModels: (models: Model[]) => void;
  addModel: (model: Model) => void;
  updateModel: (model: Model) => void;
  removeModel: (modelId: string) => void;
  
  // Selection
  selectModel: (modelId: string | null) => void;
  
  // Loading state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter & Sort
  setFilter: (filter: Partial<ModelFilter>) => void;
  clearFilter: () => void;
  setSort: (field: ModelSortField, direction: SortDirection) => void;
  
  // Queries
  getModelById: (id: string) => Model | undefined;
  getFilteredModels: () => Model[];
  canAddModel: () => boolean;
  getModelCount: () => number;
  
  // Reset
  reset: () => void;
}

type ModelStore = ModelState & ModelActions;

const initialState: ModelState = {
  models: [],
  selectedModelId: null,
  isLoading: false,
  error: null,
  filter: {},
  sortField: 'createdAt',
  sortDirection: 'desc',
};

/**
 * Model store.
 */
export const useModelStore = create<ModelStore>()((set, get) => ({
  ...initialState,

  setModels: (models) => set({ models }),

  addModel: (model) =>
    set((state) => ({
      models: [...state.models, model],
    })),

  updateModel: (model) =>
    set((state) => ({
      models: state.models.map((m) => (m.id === model.id ? model : m)),
    })),

  removeModel: (modelId) =>
    set((state) => ({
      models: state.models.filter((m) => m.id !== modelId),
      selectedModelId:
        state.selectedModelId === modelId ? null : state.selectedModelId,
    })),

  selectModel: (modelId) => set({ selectedModelId: modelId }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),

  clearFilter: () => set({ filter: {} }),

  setSort: (sortField, sortDirection) => set({ sortField, sortDirection }),

  getModelById: (id) => get().models.find((m) => m.id === id),

  getFilteredModels: () => {
    const { models, filter, sortField, sortDirection } = get();

    let filtered = [...models];

    // Apply category filter
    if (filter.category != null) {
      filtered = filtered.filter((m) => m.category === filter.category);
    }

    // Apply search filter
    if (filter.searchQuery != null && filter.searchQuery.length > 0) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter((m) =>
        m.name.toLowerCase().includes(query)
      );
    }

    // Apply bundled filter
    if (filter.includeBundled === false) {
      filtered = filtered.filter((m) => !m.isBundled);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'fileSize':
          comparison = a.metadata.fileSize - b.metadata.fileSize;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  },

  canAddModel: () => get().models.length < MODEL_LIMITS.MAX_MODELS,

  getModelCount: () => get().models.length,

  reset: () => set(initialState),
}));

/**
 * Hook to get selected model.
 */
export function useSelectedModel(): Model | undefined {
  const selectedModelId = useModelStore((state) => state.selectedModelId);
  const getModelById = useModelStore((state) => state.getModelById);
  return selectedModelId != null ? getModelById(selectedModelId) : undefined;
}

/**
 * Hook to get models by category.
 */
export function useModelsByCategory(category: ModelCategory): Model[] {
  return useModelStore((state) =>
    state.models.filter((m) => m.category === category)
  );
}
