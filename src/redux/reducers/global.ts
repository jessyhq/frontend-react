// Typescript:
import { IReduxGlobalAction } from './types'


// Constants:
import initialState from '../state'
import ACTION_TYPES from '../action-types'
import { IContextMenuTarget } from '../state/types/global'


// Functions:
const globalReducer = (state = initialState.global, action: IReduxGlobalAction) => {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL.ROOT:
      return {
        ...state,
        ...action.payload
      }
    case ACTION_TYPES.GLOBAL.BOUNDS.ROOT:
      return {
        ...state,
        bounds: {
          ...state.bounds,
          ...action.payload
        }
      }
    case ACTION_TYPES.GLOBAL.CONTEXT_MENU.ROOT:
      return {
        ...state,
        contextMenu: {
          ...state.contextMenu,
          ...action.payload
        }
      }
    case ACTION_TYPES.GLOBAL.CONTEXT_MENU.TARGET:
      console.log(action.payload)
      const newTarget = {
        ...state.contextMenu.target,
        ...action.payload as IContextMenuTarget
      }
      Object.keys(newTarget).forEach(_id => newTarget[ _id ] === undefined && delete newTarget[ _id ])
      return {
        ...state,
        contextMenu: {
          ...state.contextMenu,
          target: newTarget
        }
      }
    case ACTION_TYPES.GLOBAL.EXTENSIONS:
      return {
        ...state,
        extensions: {
          ...state.extensions,
          ...action.payload
        }
      }
    default:
      return state
  }
}


// Exports:
export default globalReducer
