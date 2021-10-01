// Typescript:
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER,
  UPDATE_CONTEXT_TARGET
} from '../action-types'
import { IContextTarget, IStateFooter, IStateGlobal } from '../reducers/types'


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

export interface IUpdateContextTarget {
  (payload: Partial<IContextTarget>): {
    type: typeof UPDATE_CONTEXT_TARGET
    payload: Partial<IContextTarget>
  }
}

export type TActionType = typeof UPDATE_GLOBAL | typeof UPDATE_FOOTER | typeof UPDATE_CONTEXT_TARGET
export type IActionPayload = Partial<IStateGlobal> | Partial<IStateFooter> | Partial<IContextTarget>
