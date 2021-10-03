// Packages:
import { DB } from 'idb'
import { nanoid } from 'nanoid'


// Constants:
import { EXTENSION_TYPE } from '../constants/extensions'


// Functions::
const populateNewLocalStorageDb = async (indexedDB: DB) => {
  try {
    const IDList = [ ...Array(3) ].map(nanoid)
    const tx = indexedDB.transaction('core', 'readwrite')
    await Promise.all([
      tx.objectStore('core').add({
        key: 'extensions',
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
      tx.objectStore('core').add({
        key: 'layout',
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
