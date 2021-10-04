// Typescript:
import { ICoreObjectStore, ILocalStorageDb } from '../../views/App/types'
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER,
  UPDATE_CONTEXT_TARGET,
  UPDATE_LOCAL_STORAGE_DB,
  UPDATE_CORE_OBJECT_STORE
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

export interface IUpdateLocalStorageDb {
  (payload: Partial<ILocalStorageDb>): {
    type: typeof UPDATE_LOCAL_STORAGE_DB
    payload: Partial<ILocalStorageDb>
  }
}

export interface IDispatchCoreObjectStore {
  type: typeof UPDATE_CORE_OBJECT_STORE
  payload: Partial<ICoreObjectStore>
}

export type TActionType = typeof UPDATE_GLOBAL | typeof UPDATE_FOOTER | typeof UPDATE_CONTEXT_TARGET | typeof UPDATE_LOCAL_STORAGE_DB | typeof UPDATE_CORE_OBJECT_STORE
export type IActionPayload = Partial<IStateGlobal> | Partial<IStateFooter> | Partial<IContextTarget> | Partial<ILocalStorageDb> | Partial<ICoreObjectStore>
