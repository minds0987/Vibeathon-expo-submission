import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';
export type BackgroundTexture = 'none' | 'dots' | 'grid' | 'waves' | 'noise';

interface ThemeStore {
  mode: ThemeMode;
  texture: BackgroundTexture;
  setMode: (mode: ThemeMode) => void;
  setTexture: (texture: BackgroundTexture) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'dark',
      texture: 'none',
      setMode: (mode) => set({ mode }),
      setTexture: (texture) => set({ texture }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'kitchenos-theme',
    }
  )
);
