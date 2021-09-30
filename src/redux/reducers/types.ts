// Typescript:
import { TActionType } from '../actions/types'
import { TTHEME } from '../../styles/types'


// Exports:
export interface IStateGlobal {
  theme: TTHEME
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
