// Typescript:
import { IReduxIndexedDBAction } from './types'


// Constants:
import initialState from '../state'
import ACTION_TYPES from '../action-types'
import { OBJECT_STORE } from '../../constants/indexedDB/objectStores'


// Functions:
const indexedDBReducer = (state = initialState.indexedDB, action: IReduxIndexedDBAction) => {
  switch (action.type) {
    case ACTION_TYPES.INDEXEDDB.ROOT:
      return {
        ...state,
        ...action.payload
      }
    case ACTION_TYPES.INDEXEDDB.OBJECT_STORE.ROOT:
      return {
        ...state,
        objectStores: {
          ...state.objectStores,
          ...action.payload
        }
      }
    case ACTION_TYPES.INDEXEDDB.OBJECT_STORE[ OBJECT_STORE.CORE ]:
      return {
        ...state,
        objectStores: {
          ...state.objectStores,
          [ OBJECT_STORE.CORE ]: {
            ...state.objectStores[ OBJECT_STORE.CORE ],
            ...action.payload
          }
        }
      }
    case ACTION_TYPES.INDEXEDDB.OBJECT_STORE[ OBJECT_STORE.EXTENSIONS ]:
      return {
        ...state,
        objectStores: {
          ...state.objectStores,
          [ OBJECT_STORE.EXTENSIONS ]: {
            ...state.objectStores[ OBJECT_STORE.EXTENSIONS ],
            ...action.payload
          }
        }
      }
    default:
      return state
  }
}


// Exports:
export default indexedDBReducer
