// Packages:
import { DB } from 'idb'
import { nanoid } from 'nanoid'


// Constants:
import { EXTENSION_TYPE } from '../constants/extensions'
import { OBJECT_STORE, OBJECT_STORE_CORE_KEYS } from '../constants/indexedDB/objectStores'


// Functions::
const populateNewLocalStorageDb = async (indexedDB: DB) => {
  try {
    const IDList = [ ...Array(3) ].map(nanoid)
    const tx = indexedDB.transaction(OBJECT_STORE.CORE, 'readwrite')
    await Promise.all([
      tx.objectStore(OBJECT_STORE.CORE).add({
        key: OBJECT_STORE_CORE_KEYS.EXTENSIONS,
        value: [
          {
            _id: IDList[0],
            type: EXTENSION_TYPE.MUSIC
          },
          {
            _id: IDList[1],
            type: EXTENSION_TYPE.TODO_LIST
          },
          {
            _id: IDList[2],
            type: EXTENSION_TYPE.TODO_LIST
          }
        ]
      }),
      tx.objectStore(OBJECT_STORE.CORE).add({
        key: OBJECT_STORE_CORE_KEYS.LAYOUT,
        value: [
          { i: IDList[0], x: 0, y: 48, w: 35 + 1, h: 8 + 2 },
          { i: IDList[1], x: 27, y: 0, w: 25 + 2, h: 35 + 1 },
          { i: IDList[2], x: 0, y: 0, w: 25 + 2, h: 35 + 1 }
        ]
      })
    ])
  } catch(e) {
    console.error(e)
  }
}


// Exports:
export default populateNewLocalStorageDb
