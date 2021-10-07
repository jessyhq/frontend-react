// Typescript:
import { TTask } from '../../../types/taskItem'


// Exports:
export interface ITaskItemProps {
  index: number
  task: TTask
  updateTask: (_id: string, newTask: Partial<TTask>) => void
  deleteTask: (_id: string) => void
  taskIndexBeingDragged?: number
}
