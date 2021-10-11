// Packages:
import { DBSchema } from 'idb'
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

export interface IIndexedDBCoreExtension {
  _id: OBJECT_STORE_CORE_IDS.EXTENSIONS
  value: IExtension[]
}

export interface IIndexedDBCoreLayout {
  _id: OBJECT_STORE_CORE_IDS.LAYOUT
  value: GridLayout.Layout[]
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

export interface IIndexedDBExtensionMusic {
  _id: EXTENSION_TYPE.MUSIC
  value: IObjectStoreExtensionMusic
}

export interface IIndexedDBExtensionTodoList {
  _id: EXTENSION_TYPE.TODO_LIST
  value: IObjectStoreExtensionTodoList
}

export interface IIndexedDB extends DBSchema {
  [ OBJECT_STORE.CORE ]: {
    key: OBJECT_STORE_CORE_IDS.EXTENSIONS
    value: IIndexedDBCoreExtension
  } | {
    key: OBJECT_STORE_CORE_IDS.LAYOUT
    value: IIndexedDBCoreLayout
  }
  [ OBJECT_STORE.EXTENSIONS ]: {
    key: EXTENSION_TYPE.MUSIC
    value: IIndexedDBExtensionMusic
  } | {
    key: EXTENSION_TYPE.TODO_LIST
    value: IIndexedDBExtensionTodoList
  }
}
