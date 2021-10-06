// Packages:
import { DB } from 'idb'
import { nanoid } from 'nanoid'
import GridLayout from 'react-grid-layout'


// Constants:
import { OBJECT_STORE, OBJECT_STORE_CORE_IDS, OBJECT_STORE_EXTENSION_IDS } from '../constants/indexedDB/objectStores'
import { IExtension, IMusicState, IObjectStoreExtensionMusic, IObjectStoreExtensionTodoList, ITodoListState } from '../indexedDB/types'
import { EXTENSION_TYPE } from '../constants/extensions'
import COLORS from '../styles/colors'
import { PLAYER_TYPE } from '../constants/extensions/Music'


// Exports:
export const DEFAULT_EXTENSION_STATE: { MUSIC: IMusicState, TODO_LIST: ITodoListState } = {
  MUSIC: {
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
  TODO_LIST: {
    color: COLORS.WHITE,
    isOn: true,
    tasks: [],
    time: {
      createdAt: Date.now(),
      lastEdited: Date.now(),
      uptime: 0
    }
  }
}

export const populateIndexedDB = async (indexedDB: DB) => {
  try {
    const IDList = [ ...Array(3) ].map(nanoid)
    const tx = {
      [ OBJECT_STORE.CORE ]: indexedDB.transaction(OBJECT_STORE.CORE, 'readwrite'),
      [ OBJECT_STORE.EXTENSIONS ]: indexedDB.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite')
    }
    await Promise.all([
      tx[ OBJECT_STORE.CORE ].objectStore<{ _id: OBJECT_STORE_CORE_IDS, value: IExtension[] }>(OBJECT_STORE.CORE).add({
        _id: OBJECT_STORE_CORE_IDS.EXTENSIONS,
        value: [ { _id: IDList[0], type: EXTENSION_TYPE.MUSIC }, { _id: IDList[1], type: EXTENSION_TYPE.TODO_LIST }, { _id: IDList[2], type: EXTENSION_TYPE.TODO_LIST } ]
      }),
      tx[ OBJECT_STORE.CORE ].objectStore<{ _id: OBJECT_STORE_CORE_IDS, value: GridLayout.Layout[] }>(OBJECT_STORE.CORE).add({
        _id: OBJECT_STORE_CORE_IDS.LAYOUT,
        value: [ { i: IDList[0], x: 0, y: 48, w: 35 + 1, h: 8 + 2 }, { i: IDList[1], x: 27, y: 0, w: 25 + 2, h: 35 + 1 }, { i: IDList[2], x: 0, y: 0, w: 25 + 2, h: 35 + 1 } ]
      }),
      tx[ OBJECT_STORE.EXTENSIONS ].objectStore<{ _id: OBJECT_STORE_EXTENSION_IDS, value: IObjectStoreExtensionMusic }>(OBJECT_STORE.EXTENSIONS).add({
        _id: OBJECT_STORE_EXTENSION_IDS.MUSIC,
        value: { [ IDList[0] ]: DEFAULT_EXTENSION_STATE.MUSIC }
      }),
      tx[ OBJECT_STORE.EXTENSIONS ].objectStore<{ _id: OBJECT_STORE_EXTENSION_IDS, value: IObjectStoreExtensionTodoList }>(OBJECT_STORE.EXTENSIONS).add({
        _id: OBJECT_STORE_EXTENSION_IDS.TODO_LIST,
        value: { [ IDList[1] ]: DEFAULT_EXTENSION_STATE.TODO_LIST, [ IDList[2] ]: DEFAULT_EXTENSION_STATE.TODO_LIST }
      })
    ])
  } catch(e) {
    console.error(e)
  }
}
