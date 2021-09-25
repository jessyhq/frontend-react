// Typescript:
import { TTask } from '../../../types/taskItem'


// Exports:
export interface ITaskItemProps {
  index: number
  task: TTask
  updateTaskDoneStatus: (_id: string, newIsDone: boolean) => void
  deleteTask: (_id: string) => void
  taskIndexBeingDragged?: number
}
