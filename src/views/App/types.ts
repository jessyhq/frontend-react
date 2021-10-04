// Packages:
import { DB } from 'idb'
import GridLayout from 'react-grid-layout'


// Constants:
import { EXTENSION_TYPE } from '../../constants/extensions'
import { OBJECT_STORE, OBJECT_STORE_CORE_KEYS } from '../../constants/indexedDB/objectStores'


// Exports:
export interface IExtension {
  _id: string
  type: typeof EXTENSION_TYPE.MUSIC | typeof EXTENSION_TYPE.TODO_LIST
}

export interface ICoreObjectStore {
  [ OBJECT_STORE_CORE_KEYS.EXTENSIONS ]: IExtension[]
  [ OBJECT_STORE_CORE_KEYS.LAYOUT ]: GridLayout.Layout[]
}

export interface ILocalStorageDb {
  isFirstTime: boolean
  db: DB | null
  objectStores: {
    [ OBJECT_STORE.CORE ]: ICoreObjectStore
  }
}
