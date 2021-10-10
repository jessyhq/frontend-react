// Packages:
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import defaultsDeep from 'lodash/defaultsDeep'
import { useInterval } from 'react-use'


// Typescript:
import { IState } from '../../../redux/reducers/types'


// Constants:
import { OBJECT_STORE } from '../../../constants/indexedDB/objectStores'
import { TIME } from '../../../constants'


// Redux:
import { updateObjectStore } from '../../../redux/actions'



// Functions:
const Uptime = () => {
  // Constants:
  const dispatch = useDispatch()

  // State:
  const objectStores = useSelector((state: IState) => state.global.localStorageDb.objectStores)
  
  // Effects:
  useInterval(() => {
    const extensions = objectStores.core.extensions
    let finalExtensionsObjectStore = {}
    extensions.forEach(extension => {
      const localExtensionState = objectStores.extensions[ extension.type ][ extension._id ]
      const newExtensionState = {
        [ extension.type ]: {
          [ extension._id ]: {
            ...localExtensionState,
            time: {
              ...localExtensionState.time,
              uptime: localExtensionState.time.uptime + TIME.MINUTE
            }
          }
        }
      }
      finalExtensionsObjectStore = defaultsDeep(finalExtensionsObjectStore, newExtensionState)
    })
    dispatch(updateObjectStore(finalExtensionsObjectStore, OBJECT_STORE.EXTENSIONS))
  }, TIME.MINUTE)
  
  // Return:
  return <></>
}


// Exports:
export default Uptime
