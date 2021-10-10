// Typescript:
import { IReduxCoreObjectStore, IReduxExtensionsObjectStore, IReduxIndexedDB } from '../../indexedDB/types'
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER,
  UPDATE_CONTEXT_TARGET,
  UPDATE_LOCAL_STORAGE_DB,
  UPDATE_CORE_OBJECT_STORE,
  UPDATE_EXTENSIONS_OBJECT_STORE
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
  (payload: Partial<IReduxIndexedDB>): {
    type: typeof UPDATE_LOCAL_STORAGE_DB
    payload: Partial<IReduxIndexedDB>
  }
}

export interface IDispatchCoreObjectStore {
  type: typeof UPDATE_CORE_OBJECT_STORE
  payload: Partial<IReduxCoreObjectStore>
}

export interface IDispatchExtensionsObjectStore {
  type: typeof UPDATE_EXTENSIONS_OBJECT_STORE
  payload: Partial<IReduxExtensionsObjectStore>
}

export type TActionType =
  typeof UPDATE_GLOBAL |
  typeof UPDATE_FOOTER |
  typeof UPDATE_CONTEXT_TARGET |
  typeof UPDATE_LOCAL_STORAGE_DB |
  typeof UPDATE_CORE_OBJECT_STORE |
  typeof UPDATE_EXTENSIONS_OBJECT_STORE

export type IActionPayload =
  Partial<IStateGlobal> &
  Partial<IStateFooter> &
  Partial<IContextTarget> &
  Partial<IReduxIndexedDB> &
  Partial<IReduxCoreObjectStore> &
  Partial<IReduxExtensionsObjectStore>
