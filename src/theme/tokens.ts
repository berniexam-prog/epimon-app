export const color = {
  night: '#0E1024',
  den: '#171A36',
  dusk: '#222648',
  line: '#303560',
  text: '#EEF0FF',
  mist: '#9A9EC4',
  violet: '#8F86F0',
  violetDeep: '#5B52C7',
  moon: '#F6EBB4',
  moonDeep: '#B9A94F',
  ember: '#FF9E5E',
  mint: '#5FD6A4',
  coral: '#FF7A7A',
} as const;

export const typography = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 34,
  display: 64,
} as const;

export const radius = {
  button: 16,
  card: 18,
  optionRow: 16,
  chip: 999,
  sheet: 28,
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 32,
} as const;

export const shadow = {
  soft: {
    shadowColor: color.night,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const fontFamily = {
  heading: 'Fredoka_600SemiBold',
  bodyRegular: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

export const ui = {
  screenPadding: 20,
  minTouchTarget: 44,
  animation: {
    spring: 220,
    easeOut: 260,
    reduced: 0,
  },
} as const;
