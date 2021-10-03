// Packages:
import { DB } from 'idb'
import GridLayout from 'react-grid-layout'


// Constants:
import { EXTENSION } from '../../constants/extensions'


// Exports:
export interface IExtension {
  _id: string
  type: typeof EXTENSION.MUSIC.type | typeof EXTENSION.TODO_LIST.type
}

export interface IJessyLocalStorageDb {
  isFirstTime: boolean
  db: DB | null
  extensions: IExtension[]
  layout: GridLayout.Layout[]
}
