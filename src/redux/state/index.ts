// Typescript:
import { IReduxState } from './types'


// Constants:
import THEMES from '../../styles/themes'
import { EXTENSION_TYPE, OBJECT_STORE, OBJECT_STORE_CORE_IDS } from '../../constants/indexedDB/objectStores'


// Constants:
const initialState : IReduxState = {
  global: {
    bounds: {
      footer: null
    },
    contextMenu: {
      isActive: false,
      target: {},
      time: {
        lastAccessed: 0
      }
    },
    extensions: {
      length: 0,
      zIndexes: {}
    },
    theme: THEMES.LIGHT
  },
  indexedDB: {
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
}


// Exports:
export default initialState
