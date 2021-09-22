// Typescript:
import { TAction, TPayload } from '../actions/types'
import { TTHEME } from '../../styles/types'


// Exports:
export interface IAction {
  type: TAction
  payload: TPayload
}

export interface IState {
  theme: TTHEME
}
