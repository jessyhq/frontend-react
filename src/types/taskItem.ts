// Exports:
export type TTask = {
  _id: string
  body?: string
  category?: {
    _id: string
    icon: string
    name: string
  }
  priority?: number
  isDone: boolean
  subTasks?: TSubTask[]
  tags?: string[]
  time: {
    createdAt: number
    whenDue?: number
  }
  title: string
}

export type TSubTask = {
  _id: string
  isDone: boolean
  time: {
    createdAt: number
  }
  title: string
}
