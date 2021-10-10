// Typescript:
import { TActionType } from '../actions/types'
import { TTHEME } from '../../styles/types'
import { IReduxIndexedDB } from '../../indexedDB/types'
import { EXTENSION_TYPE } from '../../constants/indexedDB/objectStores'


// Exports:
export interface IContextTarget {
  [ _id: string ]: EXTENSION_TYPE | undefined
}
export interface IReduxStateGlobal {
  theme: TTHEME
  contextTarget: IContextTarget
  localStorageDb: IReduxIndexedDB
}

export interface IExtensionsZIndexes { [ _id: string ]: number }

export interface IReduxStateApp {
  extensions: {
    length: number
    zIndexes: IExtensionsZIndexes
  }
}

export interface IReduxStateFooter {
  bounds: null | DOMRectReadOnly
}

export interface IAction {
  type: TActionType
  payload: any // IActionPayload
}

export interface IState {
  global: IReduxStateGlobal
  app: IReduxStateApp
  footer: IReduxStateFooter
}
