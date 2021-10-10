// Packages:
import { IDBPDatabase } from 'idb'
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

export const populateIndexedDB = async (indexedDB: IDBPDatabase<IIndexedDB>) => {
  try {
    const IDList = [ ...Array(3) ].map(nanoid)
    const tx = {
      [ OBJECT_STORE.CORE ]: indexedDB.transaction(OBJECT_STORE.CORE, 'readwrite'),
      [ OBJECT_STORE.EXTENSIONS ]: indexedDB.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite')
    }
    await Promise.all([
      tx[ OBJECT_STORE.CORE ].store.add({
        _id: OBJECT_STORE_CORE_IDS.EXTENSIONS,
        value: [ { _id: IDList[0], type: EXTENSION_TYPE.MUSIC }, { _id: IDList[1], type: EXTENSION_TYPE.TODO_LIST }, { _id: IDList[2], type: EXTENSION_TYPE.TODO_LIST } ]
      }),
      tx[ OBJECT_STORE.CORE ].store.add({
        _id: OBJECT_STORE_CORE_IDS.LAYOUT,
        value: [ { i: IDList[0], x: 0, y: 48, ...DEFAULT_EXTENSION_SIZE[ EXTENSION_TYPE.MUSIC ] }, { i: IDList[1], x: 27, y: 0, ...DEFAULT_EXTENSION_SIZE[ EXTENSION_TYPE.TODO_LIST ] }, { i: IDList[2], x: 0, y: 0, ...DEFAULT_EXTENSION_SIZE[ EXTENSION_TYPE.TODO_LIST ] } ]
      }),
      tx[ OBJECT_STORE.EXTENSIONS ].store.add({
        _id: EXTENSION_TYPE.MUSIC,
        value: { [ IDList[0] ]: DEFAULT_EXTENSION_STATE()[ EXTENSION_TYPE.MUSIC ] }
      }),
      tx[ OBJECT_STORE.EXTENSIONS ].store.add({
        _id: EXTENSION_TYPE.TODO_LIST,
        value: { [ IDList[1] ]: DEFAULT_EXTENSION_STATE()[ EXTENSION_TYPE.TODO_LIST ], [ IDList[2] ]: DEFAULT_EXTENSION_STATE()[ EXTENSION_TYPE.TODO_LIST ] }
      })
    ])
  } catch(e) {
    console.error(e)
  }
}
