'use client';

import React, { useState } from 'react';
import { useThemeStore, BackgroundTexture } from '@/store/themeStore';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const { mode, texture, toggleMode, setTexture } = useThemeStore();
  const [showTextureMenu, setShowTextureMenu] = useState(false);

  const textures: { value: BackgroundTexture; label: string; icon: string }[] = [
    { value: 'none', label: 'None', icon: '⬜' },
    { value: 'dots', label: 'Dots', icon: '⚫' },
    { value: 'grid', label: 'Grid', icon: '⊞' },
    { value: 'waves', label: 'Waves', icon: '〰️' },
    { value: 'noise', label: 'Noise', icon: '▒' },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Theme Mode Toggle */}
      <button
        onClick={toggleMode}
        className="p-2 rounded-lg bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
        title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      >
        {mode === 'dark' ? '🌙' : '☀️'}
      </button>

      {/* Texture Selector */}
      <div className="relative">
        <button
          onClick={() => setShowTextureMenu(!showTextureMenu)}
          className="p-2 rounded-lg bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          title="Background texture"
        >
          🎨
        </button>

        {showTextureMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 px-2">
                Background Texture
              </p>
              {textures.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTexture(t.value);
                    setShowTextureMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                    texture === t.value
                      ? 'bg-lime-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  {texture === t.value && <span className="ml-auto">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
