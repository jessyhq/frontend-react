// Typescript:
import { TOGGLE_THEME } from '../action-types'
import { TTHEME } from '../../styles/types'


// Exports:
export interface IToggleTheme {
  (payload: TTHEME): {
    type: typeof TOGGLE_THEME
    payload: TTHEME
  }
}
export type TAction = typeof TOGGLE_THEME
export type TPayload = TTHEME
