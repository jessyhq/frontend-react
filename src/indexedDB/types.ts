// Packages:
import { DB } from 'idb'
import GridLayout from 'react-grid-layout'


// Constants:
import { PLAYER_TYPE } from '../constants/extensions/Music'
import { OBJECT_STORE_CORE_IDS, EXTENSION_TYPE, OBJECT_STORE } from '../constants/indexedDB/objectStores'
import { TTask } from '../types/taskItem'


// Exports:
export interface IExtension {
  _id: string
  type: typeof EXTENSION_TYPE.MUSIC | typeof EXTENSION_TYPE.TODO_LIST
}

export interface ICoreObjectStore {
  [ OBJECT_STORE_CORE_IDS.EXTENSIONS ]: IExtension[]
  [ OBJECT_STORE_CORE_IDS.LAYOUT ]: GridLayout.Layout[]
}

export interface IMusicState {
  color: string
  isOn: boolean
  lastMusic: {
    option: PLAYER_TYPE,
    URL?: string
  }
  time: {
    createdAt: number
    lastEdited: number
    uptime: number
  }
}

export interface IObjectStoreExtensionMusic {
  [ _id: string ]: IMusicState
}

export interface ITodoListState {
  color: string
  isOn: boolean
  tasks: TTask[]
  time: {
    createdAt: number
    lastEdited: number
    uptime: number
  }
}

export interface IObjectStoreExtensionTodoList {
  [ _id: string ]: ITodoListState
}

export type TObjectStoreExtension = IObjectStoreExtensionMusic | IObjectStoreExtensionTodoList

export interface IExtensionsObjectStore {
  [ EXTENSION_TYPE.MUSIC ]: IObjectStoreExtensionMusic
  [ EXTENSION_TYPE.TODO_LIST ]: IObjectStoreExtensionTodoList
}

export interface ILocalStorageDb {
  isFirstTime: boolean
  db: DB | null
  objectStores: {
    [ OBJECT_STORE.CORE ]: ICoreObjectStore
    [ OBJECT_STORE.EXTENSIONS ]: IExtensionsObjectStore
  }
}
