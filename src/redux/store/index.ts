// Packages:
import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers/index'
import thunk from 'redux-thunk'


// Constants:
const store = createStore(rootReducer, applyMiddleware(thunk))


// Exports:
export default store
