// Typescript:
import {
  IUpdateGlobal,
  IUpdateFooter,
  IUpdateContextTarget
} from './types'


// Constants:
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER,
  UPDATE_CONTEXT_TARGET
} from '../action-types'


// Exports:
export const updateGlobal: IUpdateGlobal = (payload) => ({ type: UPDATE_GLOBAL, payload })
export const updateFooter: IUpdateFooter = (payload) => ({ type: UPDATE_FOOTER, payload })

export const updateContextTarget: IUpdateContextTarget = (payload) => ({ type: UPDATE_CONTEXT_TARGET, payload })
