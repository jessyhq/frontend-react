// Typescript:
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER
} from '../action-types'
import { IStateFooter, IStateGlobal } from '../reducers/types'


// Exports:
export interface IUpdateGlobal {
  (payload: IStateGlobal): {
    type: typeof UPDATE_GLOBAL
    payload: IStateGlobal
  }
}

export interface IUpdateFooter {
  (payload: IStateFooter): {
    type: typeof UPDATE_FOOTER
    payload: IStateFooter
  }
}

export type TActionType = typeof UPDATE_GLOBAL | typeof UPDATE_FOOTER
export interface IActionPayload extends IStateGlobal, IStateFooter {}
