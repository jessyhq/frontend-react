// Typescript:
import { IAction, IState } from './types'


// Constants:
import {
  UPDATE_GLOBAL, UPDATE_FOOTER, UPDATE_CONTEXT_TARGET
} from '../action-types'
import THEMES from '../../styles/themes'


// Redux:
const initialState : IState = {
  global: {
    theme: THEMES.LIGHT,
    contextTarget: {}
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
    default:
      return state
  }
}


// Exports:
export default reducer
