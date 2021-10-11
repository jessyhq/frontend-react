// Packages:
import { Dispatch } from 'react'
import GridLayout from 'react-grid-layout'
import isArrayEqual from '../../util/isArrayEqual'
import isEqual from 'lodash/isEqual'


// Typescript:
import {
  IUpdateIndexedDBRoot,
  IDispatchIndexedDBObjectStoreCore,
  IDispatchIndexedDBObjectStoreExtensions
} from './types/indexedDB'
import ACTION_TYPES from '../action-types'
import { IReduxStateIndexedDBObjectStoreCore, IReduxStateIndexedDBObjectStoreExtensions } from '../state/types/indexedDB'
import { EXTENSION_TYPE, OBJECT_STORE, OBJECT_STORE_CORE_IDS } from '../../constants/indexedDB/objectStores'
import { IReduxState } from '../state/types'
import { IExtension, IObjectStoreExtensionMusic, IObjectStoreExtensionTodoList } from '../../indexedDB/types'


// Exports:
export const updateIndexedDBRoot: IUpdateIndexedDBRoot = payload => ({ type: ACTION_TYPES.INDEXEDDB.ROOT, payload })

export const updateIndexedDBObjectStore = (
  payload: Partial<IReduxStateIndexedDBObjectStoreCore> & Partial<IReduxStateIndexedDBObjectStoreExtensions>,
  objectStore: OBJECT_STORE
) => async (
  dispatch: Dispatch<IDispatchIndexedDBObjectStoreCore | IDispatchIndexedDBObjectStoreExtensions>,
  getState: () => IReduxState
) => {
  const db = getState().indexedDB.db
  if (db) {
    if (objectStore === OBJECT_STORE.CORE) {
      const coreTransaction = db.transaction(OBJECT_STORE.CORE, 'readonly')
      const core = {
        [ OBJECT_STORE_CORE_IDS.EXTENSIONS ]: ((await coreTransaction.store.get(OBJECT_STORE_CORE_IDS.EXTENSIONS))?.value ?? []) as IExtension[],
        [ OBJECT_STORE_CORE_IDS.LAYOUT ]: ((await coreTransaction.store.get(OBJECT_STORE_CORE_IDS.LAYOUT))?.value ?? []) as GridLayout.Layout[]
      }
      if (
        payload[ OBJECT_STORE_CORE_IDS.EXTENSIONS ] &&
        !isArrayEqual(payload[ OBJECT_STORE_CORE_IDS.EXTENSIONS ] ?? [], core[ OBJECT_STORE_CORE_IDS.EXTENSIONS ] ?? [])
      ) await db.transaction(OBJECT_STORE.CORE, 'readwrite').store.put({
        _id: OBJECT_STORE_CORE_IDS.EXTENSIONS,
        value: payload[ OBJECT_STORE_CORE_IDS.EXTENSIONS ] as IExtension[]
      })
      if (
        payload[ OBJECT_STORE_CORE_IDS.LAYOUT ] &&
        !isArrayEqual(payload[ OBJECT_STORE_CORE_IDS.LAYOUT ] ?? [], core[ OBJECT_STORE_CORE_IDS.LAYOUT ] ?? [])
      ) await db.transaction(OBJECT_STORE.CORE, 'readwrite').store.put({
        _id: OBJECT_STORE_CORE_IDS.LAYOUT,
        value: payload[ OBJECT_STORE_CORE_IDS.LAYOUT ] as GridLayout.Layout[]
      })
      dispatch({ type: ACTION_TYPES.INDEXEDDB.OBJECT_STORE[ OBJECT_STORE.CORE ], payload })
    } else if (objectStore === OBJECT_STORE.EXTENSIONS) {
      const extensionsTransaction = db.transaction(OBJECT_STORE.EXTENSIONS, 'readonly')
      const extensions = {
        [ EXTENSION_TYPE.MUSIC ]: ((await extensionsTransaction.store.get(EXTENSION_TYPE.MUSIC))?.value ?? {}) as IObjectStoreExtensionMusic,
        [ EXTENSION_TYPE.TODO_LIST ]: ((await extensionsTransaction.store.get(EXTENSION_TYPE.TODO_LIST))?.value ?? {}) as IObjectStoreExtensionTodoList
      }
      if (
        payload[ EXTENSION_TYPE.MUSIC ] &&
        !isEqual(payload[ EXTENSION_TYPE.MUSIC ], extensions[ EXTENSION_TYPE.MUSIC ])
      ) await db.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite').store.put({
        _id: EXTENSION_TYPE.MUSIC,
        value: {
          ...extensions[ EXTENSION_TYPE.MUSIC ],
          ...payload[ EXTENSION_TYPE.MUSIC ]
        }
      })
      if (
        payload[ EXTENSION_TYPE.TODO_LIST ] &&
        !isEqual(payload[ EXTENSION_TYPE.TODO_LIST ], extensions[ EXTENSION_TYPE.TODO_LIST ])
      ) await db.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite').store.put({
        _id: EXTENSION_TYPE.TODO_LIST,
        value: {
          ...extensions[ EXTENSION_TYPE.TODO_LIST ],
          ...payload[ EXTENSION_TYPE.TODO_LIST ]
        }
      })
      dispatch({
        type: ACTION_TYPES.INDEXEDDB.OBJECT_STORE[ OBJECT_STORE.EXTENSIONS ],
        payload: {
          [ EXTENSION_TYPE.MUSIC ]: {
            ...extensions[ EXTENSION_TYPE.MUSIC ],
            ...payload[ EXTENSION_TYPE.MUSIC ]
          },
          [ EXTENSION_TYPE.TODO_LIST ]: {
            ...extensions[ EXTENSION_TYPE.TODO_LIST ],
            ...payload[ EXTENSION_TYPE.TODO_LIST ]
          }
        }
      })
    }
  }
}

export const deleteExtensionsFromIndexedDBObjectStoreExtensions = (
  payload: { _id: string, type: EXTENSION_TYPE }[]
) => async (
  dispatch: Dispatch<IDispatchIndexedDBObjectStoreExtensions>,
  getState: () => IReduxState
) => {
  const db = getState().indexedDB.db
  if (db) {
    const extensionsTransaction = db.transaction(OBJECT_STORE.EXTENSIONS, 'readonly')
    const extensions = {
      [ EXTENSION_TYPE.MUSIC ]: ((await extensionsTransaction.store.get(EXTENSION_TYPE.MUSIC))?.value ?? {}) as IObjectStoreExtensionMusic,
      [ EXTENSION_TYPE.TODO_LIST ]: ((await extensionsTransaction.store.get(EXTENSION_TYPE.TODO_LIST))?.value ?? {}) as IObjectStoreExtensionTodoList
    }
    if (extensions === undefined) return
    const extensionTypes = new Set()
    payload.forEach(extension => {
      extensionTypes.add(extension.type)
      delete extensions[ extension.type ][ extension._id ]
    })
    if (extensionTypes.has(EXTENSION_TYPE.MUSIC)) db.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite').store.put({
      _id: EXTENSION_TYPE.MUSIC,
      value: extensions[ EXTENSION_TYPE.MUSIC ]
    })
    if (extensionTypes.has(EXTENSION_TYPE.TODO_LIST)) db.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite').store.put({
      _id: EXTENSION_TYPE.TODO_LIST,
      value: extensions[ EXTENSION_TYPE.TODO_LIST ]
    })
    dispatch({
      type: ACTION_TYPES.INDEXEDDB.OBJECT_STORE.ROOT,
      payload: {
        [ EXTENSION_TYPE.MUSIC ]: extensions[ EXTENSION_TYPE.MUSIC ],
        [ EXTENSION_TYPE.TODO_LIST ]: extensions[ EXTENSION_TYPE.TODO_LIST ]
      }
    })
  }
}
