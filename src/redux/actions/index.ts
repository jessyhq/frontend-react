// Packages:
import { Dispatch } from 'redux'
import GridLayout from 'react-grid-layout'
import isArrayEqual from '../../util/isArrayEqual'
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
import {
  IExtension,
  IObjectStoreExtensionMusic,
  IObjectStoreExtensionTodoList,
  IReduxCoreObjectStore,
  IReduxExtensionsObjectStore
} from '../../indexedDB/types'
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
import {
  OBJECT_STORE,
  OBJECT_STORE_CORE_IDS,
  EXTENSION_TYPE
} from '../../constants/indexedDB/objectStores'


// Exports:
export const updateGlobal: IUpdateGlobal = payload => ({ type: UPDATE_GLOBAL, payload })
export const updateFooter: IUpdateFooter = payload => ({ type: UPDATE_FOOTER, payload })
export const updateContextTarget: IUpdateContextTarget = payload => ({ type: UPDATE_CONTEXT_TARGET, payload })
export const updateLocalStorageDb: IUpdateLocalStorageDb = payload => ({ type: UPDATE_LOCAL_STORAGE_DB, payload })
export const updateObjectStore = (
  payload: Partial<IReduxCoreObjectStore> & Partial<IReduxExtensionsObjectStore>,
  objectStore: OBJECT_STORE
) => async (
  dispatch: Dispatch<IDispatchCoreObjectStore | IDispatchExtensionsObjectStore>,
  getState: () => IState
) => {
  const db = getState().global.localStorageDb.db
  if (db) {
    if (objectStore === OBJECT_STORE.CORE) {
      const coreTransaction = db.transaction(OBJECT_STORE.CORE, 'readonly')
      const core = {
        [ OBJECT_STORE_CORE_IDS.EXTENSIONS ]: ((await coreTransaction.store.get(OBJECT_STORE_CORE_IDS.EXTENSIONS))?.value ?? []) as IExtension[],
        [ OBJECT_STORE_CORE_IDS.LAYOUT ]: ((await coreTransaction.store.get(OBJECT_STORE_CORE_IDS.LAYOUT))?.value ?? []) as GridLayout.Layout[]
      }
      if (payload[ OBJECT_STORE_CORE_IDS.EXTENSIONS ] && !isArrayEqual(payload[ OBJECT_STORE_CORE_IDS.EXTENSIONS ] ?? [], core[ OBJECT_STORE_CORE_IDS.EXTENSIONS ] ?? [])) await db.transaction(OBJECT_STORE.CORE, 'readwrite').store.put({ _id: OBJECT_STORE_CORE_IDS.EXTENSIONS, value: payload[ OBJECT_STORE_CORE_IDS.EXTENSIONS ] as IExtension[] })
      if (payload[ OBJECT_STORE_CORE_IDS.LAYOUT ] && !isArrayEqual(payload[ OBJECT_STORE_CORE_IDS.LAYOUT ] ?? [], core[ OBJECT_STORE_CORE_IDS.LAYOUT ] ?? [])) await db.transaction(OBJECT_STORE.CORE, 'readwrite').store.put({ _id: OBJECT_STORE_CORE_IDS.LAYOUT, value: payload[ OBJECT_STORE_CORE_IDS.LAYOUT ] as GridLayout.Layout[] })
      dispatch({ type: UPDATE_CORE_OBJECT_STORE, payload })
    } else if (objectStore === OBJECT_STORE.EXTENSIONS) {
      const extensionsTransaction = db.transaction(OBJECT_STORE.EXTENSIONS, 'readonly')
      const extensions = {
        [ EXTENSION_TYPE.MUSIC ]: ((await extensionsTransaction.store.get(EXTENSION_TYPE.MUSIC))?.value ?? {}) as IObjectStoreExtensionMusic,
        [ EXTENSION_TYPE.TODO_LIST ]: ((await extensionsTransaction.store.get(EXTENSION_TYPE.TODO_LIST))?.value ?? {}) as IObjectStoreExtensionTodoList
      }
      if (payload[ EXTENSION_TYPE.MUSIC ] && !isEqual(payload[ EXTENSION_TYPE.MUSIC ], extensions[ EXTENSION_TYPE.MUSIC ])) await db.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite').store.put({ _id: EXTENSION_TYPE.MUSIC, value: { ...extensions[ EXTENSION_TYPE.MUSIC ], ...payload[ EXTENSION_TYPE.MUSIC ] } })
      if (payload[ EXTENSION_TYPE.TODO_LIST ] && !isEqual(payload[ EXTENSION_TYPE.TODO_LIST ], extensions[ EXTENSION_TYPE.TODO_LIST ])) await db.transaction(OBJECT_STORE.EXTENSIONS, 'readwrite').store.put({ _id: EXTENSION_TYPE.TODO_LIST, value: { ...extensions[ EXTENSION_TYPE.TODO_LIST ], ...payload[ EXTENSION_TYPE.TODO_LIST ] } })
      dispatch({ type: UPDATE_EXTENSIONS_OBJECT_STORE, payload: { [ EXTENSION_TYPE.MUSIC ]: { ...extensions[ EXTENSION_TYPE.MUSIC ], ...payload[ EXTENSION_TYPE.MUSIC ] }, [ EXTENSION_TYPE.TODO_LIST ]: { ...extensions[ EXTENSION_TYPE.TODO_LIST ], ...payload[ EXTENSION_TYPE.TODO_LIST ] } } })
    }
  }
}
