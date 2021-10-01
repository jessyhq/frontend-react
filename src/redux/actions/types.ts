// Typescript:
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER
} from '../action-types'
import { IStateFooter, IStateGlobal } from '../reducers/types'


// Exports:
export interface IUpdateGlobal {
  (payload: Partial<IStateGlobal>): {
    type: typeof UPDATE_GLOBAL
    payload: Partial<IStateGlobal>
  }
}

export interface IUpdateFooter {
  (payload: Partial<IStateFooter>): {
    type: typeof UPDATE_FOOTER
    payload: Partial<IStateFooter>
  }
}

export type TActionType = typeof UPDATE_GLOBAL | typeof UPDATE_FOOTER
export interface IActionPayload extends Partial<IStateGlobal>, Partial<IStateFooter> {}
