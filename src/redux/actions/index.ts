// Packages:
import { Dispatch } from 'redux'


// Typescript:
import {
  IUpdateGlobal,
  IUpdateFooter,
  IUpdateContextTarget,
  IDispatchLocalStorageDb
} from './types'
import { ILocalStorageDb } from '../../views/App/types'
import { IState } from '../reducers/types'


// Constants:
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER,
  UPDATE_CONTEXT_TARGET,
  UPDATE_LOCAL_STORAGE_DB
} from '../action-types'


// Exports:
export const updateGlobal: IUpdateGlobal = (payload) => ({ type: UPDATE_GLOBAL, payload })
export const updateFooter: IUpdateFooter = (payload) => ({ type: UPDATE_FOOTER, payload })
export const updateContextTarget: IUpdateContextTarget = (payload) => ({ type: UPDATE_CONTEXT_TARGET, payload })
export const updateLocalStorageDb = (payload: Partial<ILocalStorageDb>) => async (dispatch: Dispatch<IDispatchLocalStorageDb>, getState: () => IState) => {
  const db = getState().global.localStorageDb.db
  if (db) {
    if (payload.extensions) await db.transaction('core', 'readwrite').objectStore('core').put({ key: 'extensions', value: payload.extensions })
    if (payload.layout) await db.transaction('core', 'readwrite').objectStore('core').put({ key: 'layout', value: payload.layout })
  }
  dispatch({
    type: UPDATE_LOCAL_STORAGE_DB,
    payload
  })
}
