// Typescript:
import { TActionType } from '../actions/types'
import { TTHEME } from '../../styles/types'


// Exports:
export interface IContextTarget {
  [ key: string ]: boolean
}
export interface IStateGlobal {
  theme: TTHEME
  contextTarget: IContextTarget
}
export interface IStateFooter {
  bounds: null | DOMRectReadOnly
}

export interface IAction {
  type: TActionType
  payload: any
}

export interface IState {
  global: IStateGlobal
  footer: IStateFooter
}
