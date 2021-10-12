// Typescript:
import { EXTENSION_TYPE } from '../../../constants/indexedDB/objectStores';
import { TTHEME } from '../../../styles/types'


// Exports:
export interface IContextMenuTarget {
  [ _id: string ]: EXTENSION_TYPE | undefined
}

export interface IExtensionsZIndexes {
  [ _id: string ]: number
}

export interface IReduxStateGlobalBounds {
  footer: null | DOMRectReadOnly
}

export interface IReduxStateGlobalContextMenu {
  isActive: boolean
  target: IContextMenuTarget
  time: {
    lastAccessed: number
  }
}

export interface IReduxStateGlobalExtensions {
  length: number
  zIndexes: IExtensionsZIndexes
}

export interface IReduxStateGlobal {
  bounds: IReduxStateGlobalBounds
  contextMenu: IReduxStateGlobalContextMenu
  extensions: IReduxStateGlobalExtensions
  theme: TTHEME
}
