// Typescript:
import { TTask } from '../../../types/taskItem'


// Exports:
export interface ITaskItemProps {
  index: number
  task: TTask
  updateTask: (_id: string, newTask: Partial<TTask>) => void
  deleteTask: (_id: string) => void
  handleTaskItemClick: (_id: string, isTaskDone: boolean, name: string) => void
  taskIndexBeingDragged?: number
}
