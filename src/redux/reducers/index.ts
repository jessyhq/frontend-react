// Typescript:
import { IAction, IState } from './types'


// Constants:
import {
  TOGGLE_THEME
} from '../action-types'
import THEMES from '../../styles/themes'


// Redux:
const initialState : IState = {
  theme: THEMES.LIGHT
}


// Functions:
const reducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        global: {
          theme: action.payload,
        },
      }
    default:
      return state
  }
}


// Exports:
export default reducer
