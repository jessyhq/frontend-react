// Typescript:
import {
  IReduxStateIndexedDBObjectStoreCore,
  IReduxStateIndexedDBObjectStoreExtensions,
  IReduxStateIndexedDB
} from '../../state/types/indexedDB'
import ACTION_TYPES from '../../action-types'
import { OBJECT_STORE } from '../../../constants/indexedDB/objectStores'


// Exports:
export interface IUpdateIndexedDBRoot {
  (payload: Partial<IReduxStateIndexedDB>): {
    type: typeof ACTION_TYPES.INDEXEDDB.ROOT
    payload: Partial<IReduxStateIndexedDB>
  }
}

export interface IDispatchIndexedDBObjectStoreCore {
  type: typeof ACTION_TYPES.INDEXEDDB.OBJECT_STORE[ OBJECT_STORE.CORE ]
  payload: Partial<IReduxStateIndexedDBObjectStoreCore>
}

export interface IDispatchIndexedDBObjectStoreExtensions {
  type: typeof ACTION_TYPES.INDEXEDDB.OBJECT_STORE[ OBJECT_STORE.EXTENSIONS ]
  payload: Partial<IReduxStateIndexedDBObjectStoreExtensions>
}
