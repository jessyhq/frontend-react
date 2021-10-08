// Typescript:
import { TActionType } from '../actions/types'
import { TTHEME } from '../../styles/types'
import { ILocalStorageDb } from '../../indexedDB/types'
import { EXTENSION_TYPE } from '../../constants/indexedDB/objectStores'


// Exports:
export interface IContextTarget {
  [ _id: string ]: EXTENSION_TYPE | undefined
}
export interface IStateGlobal {
  theme: TTHEME
  contextTarget: IContextTarget
  localStorageDb: ILocalStorageDb
}
export interface IStateFooter {
  bounds: null | DOMRectReadOnly
}

export interface IAction {
  type: TActionType
  payload: any // IActionPayload
}

export interface IState {
  global: IStateGlobal
  footer: IStateFooter
}
