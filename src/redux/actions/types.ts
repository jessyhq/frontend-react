// Typescript:
import {
  IReduxCoreObjectStore,
  IReduxExtensionsObjectStore,
  IReduxIndexedDB
} from '../../indexedDB/types'
import {
  UPDATE_GLOBAL,
  UPDATE_APP,
  UPDATE_FOOTER,
  UPDATE_CONTEXT_TARGET,
  UPDATE_LOCAL_STORAGE_DB,
  UPDATE_CORE_OBJECT_STORE,
  UPDATE_EXTENSIONS_OBJECT_STORE
} from '../action-types'
import {
  IReduxStateGlobal,
  IReduxStateApp,
  IReduxStateFooter,
  IContextTarget
} from '../reducers/types'


// Exports:
export interface IUpdateGlobal {
  (payload: Partial<IReduxStateGlobal>): {
    type: typeof UPDATE_GLOBAL
    payload: Partial<IReduxStateGlobal>
  }
}

export interface IUpdateApp {
  (payload: Partial<IReduxStateApp>): {
    type: typeof UPDATE_APP
    payload: Partial<IReduxStateApp>
  }
}

export interface IUpdateFooter {
  (payload: Partial<IReduxStateFooter>): {
    type: typeof UPDATE_FOOTER
    payload: Partial<IReduxStateFooter>
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
  typeof UPDATE_APP |
  typeof UPDATE_FOOTER |
  typeof UPDATE_CONTEXT_TARGET |
  typeof UPDATE_LOCAL_STORAGE_DB |
  typeof UPDATE_CORE_OBJECT_STORE |
  typeof UPDATE_EXTENSIONS_OBJECT_STORE

export type IActionPayload =
  Partial<IReduxStateGlobal> &
  Partial<IReduxStateApp> &
  Partial<IReduxStateFooter> &
  Partial<IContextTarget> &
  Partial<IReduxIndexedDB> &
  Partial<IReduxCoreObjectStore> &
  Partial<IReduxExtensionsObjectStore>
