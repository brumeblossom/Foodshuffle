import { create } from 'zustand';
import type { PantryItem } from '../data/types';
import { getPantry, addPantryItem, deletePantryItem } from '../data/repo';
import { normalizeIngredient, parsePantryInput } from '../core/fridgeMatcher';

interface PantryState {
  items: PantryItem[];
  isLoading: boolean;
  loadPantry: () => Promise<void>;
  addItem: (name: string) => Promise<void>;
  addItemsFromText: (text: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearPantry: () => Promise<void>;
}

export const usePantryStore = create<PantryState>((set, get) => ({
  items: [],
  isLoading: false,

  loadPantry: async () => {
    set({ isLoading: true });
    try {
      const items = await getPantry();
      // Sort by date added desc
      const sorted = items.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
      set({ items: sorted });
    } catch (err) {
      console.error('Failed to load pantry:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const normalized = normalizeIngredient(trimmed);
    const existing = get().items.find((item) => item.normalizedName === normalized);
    if (existing) return; // duplicate normalized item, ignore

    const newItem: PantryItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: trimmed,
      normalizedName: normalized,
      addedAt: new Date().toISOString(),
    };

    await addPantryItem(newItem);
    set((state) => ({ items: [newItem, ...state.items] }));
  },

  addItemsFromText: async (text: string) => {
    const parsed = parsePantryInput(text);
    if (parsed.length === 0) return;

    const currentItems = get().items;
    const currentNormalized = new Set(currentItems.map((item) => item.normalizedName));

    const newPantryItems: PantryItem[] = [];
    const addedAt = new Date().toISOString();

    for (const name of parsed) {
      const normalized = normalizeIngredient(name);
      if (!currentNormalized.has(normalized)) {
        const item: PantryItem = {
          id: Math.random().toString(36).substring(2, 9),
          name: name,
          normalizedName: normalized,
          addedAt,
        };
        newPantryItems.push(item);
        currentNormalized.add(normalized);
      }
    }

    if (newPantryItems.length === 0) return;

    // Save in bulk
    for (const item of newPantryItems) {
      await addPantryItem(item);
    }

    set((state) => ({ items: [...newPantryItems, ...state.items] }));
  },

  removeItem: async (id: string) => {
    await deletePantryItem(id);
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },

  clearPantry: async () => {
    const currentItems = get().items;
    for (const item of currentItems) {
      await deletePantryItem(item.id);
    }
    set({ items: [] });
  },
}));
