// Packages:
import { Dispatch } from 'redux'
import isArrayEqual from '../../util/isArrayEqual'
import GridLayout from 'react-grid-layout'


// Typescript:
import {
  IUpdateGlobal,
  IUpdateFooter,
  IUpdateContextTarget,
  IUpdateLocalStorageDb,
  IDispatchCoreObjectStore
} from './types'
import { ICoreObjectStore, IExtension } from '../../views/App/types'
import { IState } from '../reducers/types'


// Constants:
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER,
  UPDATE_CONTEXT_TARGET,
  UPDATE_LOCAL_STORAGE_DB,
  UPDATE_CORE_OBJECT_STORE
} from '../action-types'
import { OBJECT_STORE, OBJECT_STORE_CORE_KEYS } from '../../constants/indexedDB/objectStores'


// Exports:
export const updateGlobal: IUpdateGlobal = payload => ({ type: UPDATE_GLOBAL, payload })
export const updateFooter: IUpdateFooter = payload => ({ type: UPDATE_FOOTER, payload })
export const updateContextTarget: IUpdateContextTarget = payload => ({ type: UPDATE_CONTEXT_TARGET, payload })
export const updateLocalStorageDb: IUpdateLocalStorageDb = payload => ({ type: UPDATE_LOCAL_STORAGE_DB, payload })
export const updateObjectStore = (payload: Partial<ICoreObjectStore>, objectStore: OBJECT_STORE) => async (dispatch: Dispatch<IDispatchCoreObjectStore>, getState: () => IState) => {
  const db = getState().global.localStorageDb.db
  if (db) {
    if (objectStore === OBJECT_STORE.CORE) {
      const tx = db.transaction(OBJECT_STORE.CORE, 'readonly')
      const dbExtensions = (await tx.objectStore(OBJECT_STORE.CORE).get(OBJECT_STORE_CORE_KEYS.EXTENSIONS)).value as IExtension[]
      const dbLayout = (await tx.objectStore(OBJECT_STORE.CORE).get(OBJECT_STORE_CORE_KEYS.LAYOUT)).value as GridLayout.Layout[]
      if (payload.extensions && !isArrayEqual(payload.extensions, dbExtensions)) await db.transaction(OBJECT_STORE.CORE, 'readwrite').objectStore(OBJECT_STORE.CORE).put({
        key: OBJECT_STORE_CORE_KEYS.EXTENSIONS,
        value: payload.extensions
      })
      if (payload.layout && !isArrayEqual(payload.layout, dbLayout)) await db.transaction(OBJECT_STORE.CORE, 'readwrite').objectStore(OBJECT_STORE.CORE).put({
        key: OBJECT_STORE_CORE_KEYS.LAYOUT,
        value: payload.layout
      })
      dispatch({
        type: UPDATE_CORE_OBJECT_STORE,
        payload
      })
    }
  }
}
