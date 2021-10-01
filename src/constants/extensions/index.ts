// Components:
import Music from '../../components/extensions/Music'
import TodoList from '../../components/extensions/TodoList'
import Timer from '../../components/extensions/Timer'


// Typescript:
interface IExtension {
  [ key: string ]: {
    type: string
    component: ({ _id }: { _id: string }) => JSX.Element
  }
}


// Exports:
export const EXTENSION: IExtension = {
  MUSIC: {
    type: 'MUSIC',
    component: Music
  },
  TODO_LIST: {
    type:'TODO_LIST',
    component: TodoList
  },
  TIMER: {
    type:'TIMER',
    component: Timer
  }
}
