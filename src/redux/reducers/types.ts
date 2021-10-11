// Typescript:
import {
  TReduxGlobalReducerActionType,
  TReduxGlobalReducerActionPayload,
  TReduxIndexedDBReducerActionType,
  TReduxIndexedDBReducerActionPayload,
  TReduxActionType
} from '../actions/types'


// Exports:
export interface IReduxGlobalAction {
  type: TReduxGlobalReducerActionType
  payload: TReduxGlobalReducerActionPayload
}

export interface IReduxIndexedDBAction {
  type: TReduxIndexedDBReducerActionType
  payload: TReduxIndexedDBReducerActionPayload
}

export interface IReduxAction {
  type: TReduxActionType
  payload: any // IReduxActionPayload
}
