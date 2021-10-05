// Packages:
import { DB } from 'idb'
import GridLayout from 'react-grid-layout'


// Constants:
import { EXTENSION_TYPE } from '../constants/extensions'
import { PLAYER_TYPE } from '../constants/extensions/Music'
import { OBJECT_STORE_CORE_IDS, OBJECT_STORE_EXTENSION_IDS, OBJECT_STORE } from '../constants/indexedDB/objectStores'
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
  lastMusicOption: PLAYER_TYPE
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

export interface IExtensionsObjectStore {
  [ OBJECT_STORE_EXTENSION_IDS.MUSIC ]: IObjectStoreExtensionMusic
  [ OBJECT_STORE_EXTENSION_IDS.TODO_LIST ]: IObjectStoreExtensionTodoList
}

export interface ILocalStorageDb {
  isFirstTime: boolean
  db: DB | null
  objectStores: {
    [ OBJECT_STORE.CORE ]: ICoreObjectStore
    [ OBJECT_STORE.EXTENSIONS ]: IExtensionsObjectStore
  }
}
