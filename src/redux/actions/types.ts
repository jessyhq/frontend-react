// Typescript:
import { OBJECT_STORE } from '../../constants/indexedDB/objectStores'
import {
  IReduxStateGlobal,
  IReduxStateGlobalBounds,
  IReduxStateGlobalContextMenu,
  IReduxStateGlobalExtensions
} from '../state/types/global'
import {
  IReduxStateIndexedDB,
  IReduxStateIndexedDBObjectStoreCore,
  IReduxStateIndexedDBObjectStoreExtensions
} from '../state/types/indexedDB'


// Constants:
import ACTION_TYPES from '../action-types'


// Exports:
export type TReduxGlobalReducerActionType =
  typeof ACTION_TYPES.GLOBAL.BOUNDS |
  typeof ACTION_TYPES.GLOBAL.CONTEXT_MENU |
  typeof ACTION_TYPES.GLOBAL.EXTENSIONS |
  typeof ACTION_TYPES.GLOBAL.ROOT

export type TReduxIndexedDBReducerActionType =
  typeof ACTION_TYPES.INDEXEDDB.OBJECT_STORE.ROOT |
  typeof ACTION_TYPES.INDEXEDDB.OBJECT_STORE[ OBJECT_STORE.CORE ] |
  typeof ACTION_TYPES.INDEXEDDB.OBJECT_STORE[ OBJECT_STORE.EXTENSIONS ] |
  typeof ACTION_TYPES.INDEXEDDB.ROOT

export type TReduxActionType =
  TReduxGlobalReducerActionType |
  TReduxIndexedDBReducerActionType

export type TReduxGlobalReducerActionPayload =
  Partial<IReduxStateGlobal> &
  Partial<IReduxStateGlobalBounds> &
  Partial<IReduxStateGlobalContextMenu> &
  Partial<IReduxStateGlobalExtensions>

export type TReduxIndexedDBReducerActionPayload =
  Partial<IReduxStateIndexedDB> &
  Partial<IReduxStateIndexedDBObjectStoreCore> &
  Partial<IReduxStateIndexedDBObjectStoreExtensions>

export type IReduxActionPayload =
  TReduxGlobalReducerActionPayload &
  TReduxIndexedDBReducerActionPayload
