'use client';

import React from 'react';
import { useThemeStore } from '@/store/themeStore';

export function BackgroundTexture() {
  const { texture, mode } = useThemeStore();

  if (texture === 'none') return null;

  const getTextureStyle = () => {
    const isDark = mode === 'dark';
    const opacity = isDark ? '0.03' : '0.05';
    
    switch (texture) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(255,255,255,' + opacity + ')' : 'rgba(0,0,0,' + opacity + ')'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(255,255,255,' + opacity + ')' : 'rgba(0,0,0,' + opacity + ')'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,' + opacity + ')' : 'rgba(0,0,0,' + opacity + ')'} 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        };
      case 'waves':
        return {
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            ${isDark ? 'rgba(255,255,255,' + opacity + ')' : 'rgba(0,0,0,' + opacity + ')'} 10px,
            ${isDark ? 'rgba(255,255,255,' + opacity + ')' : 'rgba(0,0,0,' + opacity + ')'} 20px
          )`,
        };
      case 'noise':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${isDark ? '0.03' : '0.05'}'/%3E%3C/svg%3E")`,
        };
      default:
        return {};
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={getTextureStyle()}
    />
  );
}
