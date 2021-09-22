// Typescript:
import { IToggleTheme } from './types'


// Constants:
import {
  TOGGLE_THEME
} from '../action-types'


// Exports:
export const toggleTheme: IToggleTheme = (payload) => {
  return { type: TOGGLE_THEME, payload }
}
