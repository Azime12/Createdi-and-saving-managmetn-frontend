// src/theme/colors.ts
import chroma from 'chroma-js';

// 1. Define strict types first
type BrandShades = Readonly<{
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
}>;

type BrandPalette = Readonly<{
  DEFAULT: string;
  light: string;
  dark: string;
  contrast: string;
  shades: BrandShades;
}>;

// 2. Base color with environment fallback
const BRAND_COLOR = '#03ac6b';

// 3. Palette generator (no 'as const' needed)
const generateBrandPalette = (baseColor: string): BrandPalette => {
  const color = chroma(baseColor);
  
  return {
    DEFAULT: baseColor,
    light: color.brighten(0.3).hex(),
    dark: color.darken(0.4).hex(),
    contrast: color.luminance() > 0.22 ? '#000000' : '#FFFFFF',
    shades: {
      100: color.brighten(1.2).hex(),
      200: color.brighten(0.6).hex(),
      300: baseColor,
      400: color.darken(0.3).hex(),
      500: color.darken(0.6).hex(),
    }
  };
};

// 4. Export frozen object for immutability
export const brandColors = Object.freeze(generateBrandPalette(BRAND_COLOR));