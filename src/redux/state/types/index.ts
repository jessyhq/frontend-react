// Typescript:
import { IReduxStateGlobal } from './global'
import { IReduxStateIndexedDB } from './indexedDB'


// Exports:
export interface IReduxState {
  global: IReduxStateGlobal
  indexedDB: IReduxStateIndexedDB
}
