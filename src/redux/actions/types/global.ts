// Typescript:
import {
  IReduxStateGlobal,
  IReduxStateGlobalBounds,
  IReduxStateGlobalContextMenu,
  IContextMenuTarget,
  IReduxStateGlobalExtensions
} from '../../state/types/global'
import ACTION_TYPES from '../../action-types'


// Exports:
export interface IUpdateGlobalRoot {
  (payload: Partial<IReduxStateGlobal>): {
    type: typeof ACTION_TYPES.GLOBAL.ROOT
    payload: Partial<IReduxStateGlobal>
  }
}

export interface IUpdateGlobalBoundsRoot {
  (payload: Partial<IReduxStateGlobalBounds>): {
    type: typeof ACTION_TYPES.GLOBAL.BOUNDS.ROOT
    payload: Partial<IReduxStateGlobalBounds>
  }
}

export interface IUpdateGlobalContextMenuRoot {
  (payload: Partial<IReduxStateGlobalContextMenu>): {
    type: typeof ACTION_TYPES.GLOBAL.CONTEXT_MENU.ROOT
    payload: Partial<IReduxStateGlobalContextMenu>
  }
}

export interface IUpdateGlobalContextMenuTarget {
  (payload: IContextMenuTarget): {
    type: typeof ACTION_TYPES.GLOBAL.CONTEXT_MENU.TARGET
    payload: IContextMenuTarget
  }
}

export interface IUpdateGlobalExtensions {
  (payload: Partial<IReduxStateGlobalExtensions>): {
    type: typeof ACTION_TYPES.GLOBAL.EXTENSIONS
    payload: Partial<IReduxStateGlobalExtensions>
  }
}
