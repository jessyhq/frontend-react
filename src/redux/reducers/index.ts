// Typescript:
import { IAction, IState } from './types'


// Constants:
import {
  UPDATE_GLOBAL,
  UPDATE_FOOTER,
  UPDATE_CONTEXT_TARGET,
  UPDATE_LOCAL_STORAGE_DB,
  UPDATE_CORE_OBJECT_STORE,
  UPDATE_EXTENSIONS_OBJECT_STORE
} from '../action-types'
import THEMES from '../../styles/themes'
import { OBJECT_STORE, OBJECT_STORE_CORE_IDS, EXTENSION_TYPE } from '../../constants/indexedDB/objectStores'


// Redux:
const initialState : IState = {
  global: {
    theme: THEMES.LIGHT,
    contextTarget: {},
    localStorageDb: {
      isFirstTime: false,
      db: null,
      objectStores: {
        [ OBJECT_STORE.CORE ]: {
          [ OBJECT_STORE_CORE_IDS.EXTENSIONS ]: [],
          [ OBJECT_STORE_CORE_IDS.LAYOUT ]: []
        },
        [ OBJECT_STORE.EXTENSIONS ]: {
          [ EXTENSION_TYPE.MUSIC ]: {},
          [ EXTENSION_TYPE.TODO_LIST ]: {}
        }
      }
    }
  },
  footer: {
    bounds: null
  }
}


// Functions:
const reducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case UPDATE_GLOBAL:
      return {
        ...state,
        global: {
          ...state.global,
          ...action.payload
        }
      }
    case UPDATE_FOOTER:
      return {
        ...state,
        footer: {
          ...state.footer,
          ...action.payload
        }
      }
    case UPDATE_CONTEXT_TARGET:
      return {
        ...state,
        global: {
          ...state.global,
          contextTarget: {
            ...state.global.contextTarget,
            ...action.payload
          }
        }
      }
    case UPDATE_LOCAL_STORAGE_DB:
      return {
        ...state,
        global: {
          ...state.global,
          localStorageDb: {
            ...state.global.localStorageDb,
            ...action.payload
          }
        }
      }
    case UPDATE_CORE_OBJECT_STORE:
      return {
        ...state,
        global: {
          ...state.global,
          localStorageDb: {
            ...state.global.localStorageDb,
            objectStores: {
              ...state.global.localStorageDb.objectStores,
              [ OBJECT_STORE.CORE ]: {
                ...state.global.localStorageDb.objectStores[ OBJECT_STORE.CORE ],
                ...action.payload
              }
            }
          }
        }
      }
    case UPDATE_EXTENSIONS_OBJECT_STORE:
      return {
        ...state,
        global: {
          ...state.global,
          localStorageDb: {
            ...state.global.localStorageDb,
            objectStores: {
              ...state.global.localStorageDb.objectStores,
              [ OBJECT_STORE.EXTENSIONS ]: {
                ...action.payload
              }
            }
          }
        }
      }
    default:
      return state
  }
}


// Exports:
export default reducer
