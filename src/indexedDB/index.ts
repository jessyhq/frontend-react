// Packages:
import { IDBPDatabase, IDBPTransaction } from 'idb'
import { nanoid } from 'nanoid'


// Constants:
import { EXTENSION_TYPE, OBJECT_STORE, OBJECT_STORE_CORE_IDS } from '../constants/indexedDB/objectStores'
import { IIndexedDB, IMusicState, ITodoListState } from '../indexedDB/types'
import COLORS from '../styles/colors'
import { PLAYER_TYPE } from '../constants/extensions/Music'


// Exports:
export const DEFAULT_EXTENSION_STATE = (): { [ EXTENSION_TYPE.MUSIC ]: IMusicState, [ EXTENSION_TYPE.TODO_LIST ]: ITodoListState } => ({
  [ EXTENSION_TYPE.MUSIC ]: {
    color: COLORS.WHITE,
    isOn: true,
    lastMusic: {
      option: PLAYER_TYPE.SPOTIFY
    },
    time: {
      createdAt: Date.now(),
      lastEdited: Date.now(),
      uptime: 0
    }
  },
  [ EXTENSION_TYPE.TODO_LIST ]: {
    color: COLORS.WHITE,
    isOn: true,
    tasks: [],
    time: {
      createdAt: Date.now(),
      lastEdited: Date.now(),
      uptime: 0
    }
  }
})

export const DEFAULT_EXTENSION_SIZE = {
  [ EXTENSION_TYPE.MUSIC ]: { w: 35 + 1, h: 8 + 2 },
  [ EXTENSION_TYPE.TODO_LIST ]: { w: 25 + 2, h: 35 + 1}
}

export const OBJECTS_STORE_CREATION_PROPS = {
  [ OBJECT_STORE.CORE ]: {
    name: OBJECT_STORE.CORE,
    optionalParameters: { keyPath: '_id', autoIncrement: false }
  },
  [ OBJECT_STORE.EXTENSIONS ]: {
    name: OBJECT_STORE.EXTENSIONS,
    optionalParameters: { keyPath: '_id', autoIncrement: false }
  },
}

export const populateObjectStore = async (
  transaction: IDBPTransaction<IIndexedDB, OBJECT_STORE[], 'versionchange'>,
  name: OBJECT_STORE,
  IDList: string[]
) => {
  try {
    if (name === OBJECT_STORE.CORE) {
      await Promise.all([
        transaction.objectStore(name).add({
          _id: OBJECT_STORE_CORE_IDS.EXTENSIONS,
          value: [ { _id: IDList[0], type: EXTENSION_TYPE.MUSIC }, { _id: IDList[1], type: EXTENSION_TYPE.TODO_LIST }, { _id: IDList[2], type: EXTENSION_TYPE.TODO_LIST } ]
        }),
        transaction.objectStore(name).add({
          _id: OBJECT_STORE_CORE_IDS.LAYOUT,
          value: [
            { i: IDList[0], x: 0, y: 48, ...DEFAULT_EXTENSION_SIZE[ EXTENSION_TYPE.MUSIC ] },
            { i: IDList[1], x: 27, y: 0, ...DEFAULT_EXTENSION_SIZE[ EXTENSION_TYPE.TODO_LIST ] },
            { i: IDList[2], x: 0, y: 0, ...DEFAULT_EXTENSION_SIZE[ EXTENSION_TYPE.TODO_LIST ] }
          ]
        })
      ])
    } else if (name === OBJECT_STORE.EXTENSIONS) {
      await Promise.all([
        transaction.objectStore(name).add({
          _id: EXTENSION_TYPE.MUSIC,
          value: { [ IDList[0] ]: DEFAULT_EXTENSION_STATE()[ EXTENSION_TYPE.MUSIC ] }
        }),
        transaction.objectStore(name).add({
          _id: EXTENSION_TYPE.TODO_LIST,
          value: { [ IDList[1] ]: DEFAULT_EXTENSION_STATE()[ EXTENSION_TYPE.TODO_LIST ], [ IDList[2] ]: DEFAULT_EXTENSION_STATE()[ EXTENSION_TYPE.TODO_LIST ] }
        })
      ])
    }
  } catch (e) {
    console.error(e)
  }
}

export const upgradeObjectStore = async (
  indexedDB: IDBPDatabase<IIndexedDB>,
  transaction: IDBPTransaction<IIndexedDB, OBJECT_STORE[], 'versionchange'>,
  name: OBJECT_STORE,
  optionalParameters: { keyPath: string, autoIncrement: boolean },
  IDList: string[]
) => {
  let objectStore
  if (indexedDB.objectStoreNames.contains(name)) objectStore = transaction.objectStore(name)
  else {
    objectStore = indexedDB.createObjectStore(OBJECTS_STORE_CREATION_PROPS[ name ].name, OBJECTS_STORE_CREATION_PROPS[ name ].optionalParameters)
    await populateObjectStore(transaction, name, IDList)
    return
  } if (objectStore.keyPath !== optionalParameters.keyPath) {
    const objectStoreEntries = await objectStore.getAll()
    objectStoreEntries.map(entry => ({ [ optionalParameters.keyPath ]: entry._id, value: entry.value })) // NOTE: add entry.value update function here
    indexedDB.deleteObjectStore(name)
    indexedDB.createObjectStore(OBJECTS_STORE_CREATION_PROPS[ name ].name, OBJECTS_STORE_CREATION_PROPS[ name ].optionalParameters)
    for (const entry of objectStoreEntries) await transaction.objectStore(name).add(entry)
  }
}

export const handleIndexedDBUpgrade = async (indexedDB: IDBPDatabase<IIndexedDB>, transaction: IDBPTransaction<IIndexedDB, OBJECT_STORE[], 'versionchange'>) => {
  const IDList = [ ...Array(3) ].map(nanoid)
  await upgradeObjectStore(indexedDB, transaction, OBJECT_STORE.CORE, OBJECTS_STORE_CREATION_PROPS[ OBJECT_STORE.CORE ].optionalParameters, IDList)
  await upgradeObjectStore(indexedDB, transaction, OBJECT_STORE.EXTENSIONS, OBJECTS_STORE_CREATION_PROPS[ OBJECT_STORE.EXTENSIONS ].optionalParameters, IDList)
}
