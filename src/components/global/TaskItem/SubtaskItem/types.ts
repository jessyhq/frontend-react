// Typescript:
import { TSubtask } from '../../../../types/taskItem'


// Exports:
export interface ISubtaskItemProps {
  subtask: TSubtask,
  updateSubtask: (subtaskID: string, newSubtask: Partial<TSubtask>) => void
}
