// Packages:
import { DB } from 'idb'
import GridLayout from 'react-grid-layout'


// Constants:
import { EXTENSION_TYPE } from '../../constants/extensions'


// Exports:
export interface IExtension {
  _id: string
  type: typeof EXTENSION_TYPE.MUSIC | typeof EXTENSION_TYPE.TODO_LIST
}

export interface ILocalStorageDb {
  isFirstTime: boolean
  db: DB | null
  extensions: IExtension[]
  layout: GridLayout.Layout[]
}
