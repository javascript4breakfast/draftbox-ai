export const STYLE_OPTIONS = [
  'photorealistic',
  'anime',
  'watercolor',
  'low-poly',
  'isometric',
  'pixel art',
  '3D render',
  'oil painting'
] as const;

export const PALETTE_OPTIONS = [
  'default',
  'pastel',
  'neon',
  'monochrome',
  'earth tones',
  'duotone',
  'vibrant'
] as const;

export type FormatValue = 'square' | 'landscape' | 'portrait' | 'widescreen';

export const FORMAT_OPTIONS = [
  { label: 'Square (1:1)', value: 'square' as const },
  { label: 'Landscape (4:3)', value: 'landscape' as const },
  { label: 'Portrait (3:4)', value: 'portrait' as const },
  { label: 'Widescreen (16:9)', value: 'widescreen' as const },
] as const;

