// Exports:
export type TTask = {
  _id: string
  body?: string
  category?: {
    _id: string
    icon: string
    name: string
  }
  parentID: string
  priority?: number
  isDone: boolean
  subTasks?: TSubtask[]
  tags?: string[]
  time: {
    createdAt: number
    lastEdited: number
    whenDue?: number
  }
  title: string
}

export type TSubtask = {
  _id: string
  isDone: boolean
  taskID: string
  time: {
    createdAt: number
    lastEdited: number
  }
  title: string
}
