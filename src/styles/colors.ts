// Packages:
import Color from 'color';


// Exports:
export const COLORS = {
  PRIMARY: '#46ACC2',
  WHITE: '#F8F8FA',
  BLACK: '#121212'
}

export const THEME_COLOR = {
  OCEAN: '#1D61E5'
}

export const SECONDARY_COLORS = {
  BORDER_COLOR: {
    DARK: (hue: number) => Color(COLORS.BLACK).hue(hue).saturationl(6).lightness(25).alpha(0.7)
  },
  WIDGET_BACKGROUND: {
    DARK: (hue: number) => Color(COLORS.BLACK).hue(hue).saturationl(9).lightness(13).alpha(0.7)
  },
  ELEMENT: {
    ACTIVE: {
      DARK: Color(COLORS.WHITE).darken(0.075) // E2E2E2 / E2E2EA
    },
    PASSIVE: {
      DARK: Color(COLORS.WHITE).darken(0.438) // 797979 / 79799F
    },
    PLACEHOLDER: {
      DARK: Color(COLORS.WHITE).darken(0.565).desaturate(0.2) // Color(COLORS.WHITE).darken(0.7).desaturate(0.2) // 5E5E5E / 414155 / 5E5E7B
    }
  },
  WRAPPER: {
    SOLID: {
      DARK: Color(COLORS.BLACK).lighten(0.25) // 171717 / 171717
    },
    TRANSPARENT: {
      ACTIVE: (hue: number) => Color(COLORS.WHITE).hue(hue).darken(0.3),
      PASSIVE: (hue: number) => Color(COLORS.WHITE).hue(hue).darken(0.5) // 2A2E2F / 2A2F2E
    }
  }
}
