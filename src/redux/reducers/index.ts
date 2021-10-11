// Packages:
import { combineReducers } from 'redux'


// Redux:
import globalReducer from './global'
import indexedDBReducer from './indexedDB'


// Exports:
export default combineReducers({
  global: globalReducer,
  indexedDB: indexedDBReducer
})
