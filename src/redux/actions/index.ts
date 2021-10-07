// Packages:
import { Dispatch } from 'redux'
import isArrayEqual from '../../util/isArrayEqual'
import GridLayout from 'react-grid-layout'
import isEqual from 'lodash/isEqual'


// Typescript:
import {
  IUpdateGlobal,
  IUpdateFooter,
  IUpdateContextTarget,
  IUpdateLocalStorageDb,
  IDispatchCoreObjectStore,
  IDispatchExtensionsObjectStore
} from './types'
import { ICoreObjectStore, IExtension, IExtensionsObjectStore, IObjectStoreExtensionMusic, IObjectStoreExtensionTodoList } from '../../indexedDB/types'
import { IState } from '../reducers/types'


// Constants:
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER,
  UPDATE_CONTEXT_TARGET,
  UPDATE_LOCAL_STORAGE_DB,
  UPDATE_CORE_OBJECT_STORE,
  UPDATE_EXTENSIONS_OBJECT_STORE
} from '../action-types'
import { OBJECT_STORE, OBJECT_STORE_CORE_IDS, EXTENSION_TYPE } from '../../constants/indexedDB/objectStores'


// Exports:
export const updateGlobal: IUpdateGlobal = payload => ({ type: UPDATE_GLOBAL, payload })
export const updateFooter: IUpdateFooter = payload => ({ type: UPDATE_FOOTER, payload })
export const updateContextTarget: IUpdateContextTarget = payload => ({ type: UPDATE_CONTEXT_TARGET, payload })
export const updateLocalStorageDb: IUpdateLocalStorageDb = payload => ({ type: UPDATE_LOCAL_STORAGE_DB, payload })
export const updateObjectStore = (
  payload: Partial<ICoreObjectStore> & Partial<IExtensionsObjectStore>,
  objectStore: OBJECT_STORE
) => async (
  dispatch: Dispatch<IDispatchCoreObjectStore | IDispatchExtensionsObjectStore>,
  getState: () => IState
) => {
  const db = getState().global.localStorageDb.db
  if (db) {
    if (objectStore === OBJECT_STORE.CORE) {
      const tx = db.transaction(OBJECT_STORE.CORE, 'readonly')
      const extensions = (await tx.objectStore(OBJECT_STORE.CORE).get(OBJECT_STORE_CORE_IDS.EXTENSIONS)).value as IExtension[]
      const layout = (await tx.objectStore(OBJECT_STORE.CORE).get(OBJECT_STORE_CORE_IDS.LAYOUT)).value as GridLayout.Layout[]
      if (payload.extensions && !isArrayEqual(payload.extensions, extensions)) await db.transaction(OBJECT_STORE.CORE, 'readwrite').objectStore(OBJECT_STORE.CORE).put({ _id: OBJECT_STORE_CORE_IDS.EXTENSIONS, value: payload.extensions })
      if (payload.layout && !isArrayEqual(payload.layout, layout)) await db.transaction(OBJECT_STORE.CORE, 'readwrite').objectStore(OBJECT_STORE.CORE).put({ _id: OBJECT_STORE_CORE_IDS.LAYOUT, value: payload.layout })
      dispatch({ type: UPDATE_CORE_OBJECT_STORE, payload })
    } else if (objectStore === OBJECT_STORE.EXTENSIONS) {
      const tx = db.transaction(OBJECT_STORE.EXTENSIONS, 'readonly')
      const indexedDBMusic = (await tx.objectStore(OBJECT_STORE.EXTENSIONS).get(EXTENSION_TYPE.MUSIC)).value as IObjectStoreExtensionMusic
      const indexedDBTodoList = (await tx.objectStore(OBJECT_STORE.EXTENSIONS).get(EXTENSION_TYPE.TODO_LIST)).value as IObjectStoreExtensionTodoList
      if (payload.music && !isEqual(payload.music, indexedDBMusic)) await db.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite').objectStore(OBJECT_STORE.EXTENSIONS).put({ _id: EXTENSION_TYPE.MUSIC, value: { ...indexedDBMusic, ...payload.music } })
      if (payload.todo_list && !isEqual(payload.todo_list, indexedDBTodoList)) await db.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite').objectStore(OBJECT_STORE.EXTENSIONS).put({ _id: EXTENSION_TYPE.TODO_LIST, value: { ...indexedDBTodoList, ...payload.todo_list } })
      dispatch({ type: UPDATE_EXTENSIONS_OBJECT_STORE, payload: { music: { ...indexedDBMusic, ...payload.music }, todo_list: { ...indexedDBTodoList, ...payload.todo_list } } })
    }
  }
}
