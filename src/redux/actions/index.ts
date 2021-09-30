// Typescript:
import {
  IUpdateGlobal,
  IUpdateFooter
} from './types'


// Constants:
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER
} from '../action-types'


// Exports:
export const updateGlobal: IUpdateGlobal = (payload) => ({ type: UPDATE_GLOBAL, payload })
export const updateFooter: IUpdateFooter = (payload) => ({ type: UPDATE_FOOTER, payload })
