// Packages:
import Color from 'color'


// Constants:
import { COLORS } from './colors'


// Exports:
export const SMOOTH_INNER_SHADOW = `inset 5px 2px 6px -9px ${ Color(COLORS.WHITE).darken(0.6).hex() }, inset -3px -4px 3px -5px ${ Color(COLORS.WHITE).darken(0.6).hex() }`
// Generated using https://shadows.brumm.af/
export const SMOOTH_SHADOW = `0px 0.7px 2.3px rgba(0, 0, 0, 0.024), 0px 1.9px 6.3px rgba(0, 0, 0, 0.035), 0px 4.5px 15.1px rgba(0, 0, 0, 0.046), 0px 15px 50px rgba(0, 0, 0, 0.07)`
