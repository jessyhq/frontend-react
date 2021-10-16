// Typescript:
import { TTask } from '../../../../types/taskItem'


// Exports:
export interface IFocusedTaskItemProps {
  task: TTask
  updateTask: (_id: string, newTask: Partial<TTask>) => void
}
