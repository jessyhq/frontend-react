// Typescript:
import {
  IUpdateGlobalRoot,
  IUpdateGlobalBoundsRoot,
  IUpdateGlobalContextMenuRoot,
  IUpdateGlobalContextMenuTarget,
  IUpdateGlobalExtensions,
} from './types/global'


// Constants:
import ACTION_TYPES from '../action-types'


// Exports:
export const updateGlobalRoot: IUpdateGlobalRoot = payload => ({ type: ACTION_TYPES.GLOBAL.ROOT, payload })
export const updateGlobalBoundsRoot: IUpdateGlobalBoundsRoot = payload => ({ type: ACTION_TYPES.GLOBAL.BOUNDS.ROOT, payload })
export const updateGlobalContextMenuRoot: IUpdateGlobalContextMenuRoot = payload => ({ type: ACTION_TYPES.GLOBAL.CONTEXT_MENU.ROOT, payload })
export const updateGlobalContextMenuTarget: IUpdateGlobalContextMenuTarget = payload => ({ type: ACTION_TYPES.GLOBAL.CONTEXT_MENU.TARGET, payload })
export const updateGlobalExtensions: IUpdateGlobalExtensions = payload => ({ type: ACTION_TYPES.GLOBAL.EXTENSIONS, payload })
