// Packages:
import GridLayout from 'react-grid-layout'
import { IDBPDatabase } from 'idb'


// Typescript:
import {
  IExtension,
  IIndexedDB,
  IObjectStoreExtensionMusic,
  IObjectStoreExtensionTodoList
} from '../../../indexedDB/types'
import {
  OBJECT_STORE_CORE_IDS,
  EXTENSION_TYPE,
  OBJECT_STORE
} from '../../../constants/indexedDB/objectStores'


// Exports:
export interface IReduxStateIndexedDBObjectStoreCore {
  [ OBJECT_STORE_CORE_IDS.EXTENSIONS ]: IExtension[]
  [ OBJECT_STORE_CORE_IDS.LAYOUT ]: GridLayout.Layout[]
}

export interface IReduxStateIndexedDBObjectStoreExtensions {
  [ EXTENSION_TYPE.MUSIC ]: IObjectStoreExtensionMusic
  [ EXTENSION_TYPE.TODO_LIST ]: IObjectStoreExtensionTodoList
}

export interface IReduxStateIndexedDB {
  isFirstTime: boolean
  db: IDBPDatabase<IIndexedDB> | null
  objectStores: {
    [ OBJECT_STORE.CORE ]: IReduxStateIndexedDBObjectStoreCore,
    [ OBJECT_STORE.EXTENSIONS ]: IReduxStateIndexedDBObjectStoreExtensions
  }
}
