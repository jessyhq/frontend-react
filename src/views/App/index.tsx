// Packages:
import React, { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { useDispatch, useSelector } from 'react-redux'
import { openDb } from 'idb'
import isArrayEqual from '../../util/isArrayEqual'
import GridLayout, { WidthProvider } from 'react-grid-layout'


// Typescript:
import { IExtension } from './types'


// Constants:
import COLORS from '../../styles/colors'
import { EXTENSION_TYPE } from '../../constants/extensions'
import { OBJECT_STORE, OBJECT_STORE_CORE_KEYS } from '../../constants/indexedDB/objectStores'
import populateNewLocalStorageDb from '../../util/populateNewLocalStorageDb'


// Components:
import Music from '../../components/extensions/Music'
import TodoList from '../../components/extensions/TodoList'


// Redux:
import { updateLocalStorageDb, updateObjectStore } from '../../redux/actions'
import { IState } from '../../redux/reducers/types'



// Styles:
const Wrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 97vh;
`

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 97vh;
  background-color: ${ COLORS.WHITE };
  opacity: 0.6;
  background-image: radial-gradient(${ Color(COLORS.BLACK).lighten(5).toString() } 1.15px, ${ COLORS.WHITE } 1.15px);
  background-size: 1.5rem 1.5rem;
  background-position: center;
`


// Functions:
const GridLayoutWithWidth = WidthProvider(GridLayout)

const App = () => {
  // Constants:
  const dispatch = useDispatch()

  // State:
  const localStorageDb = useSelector((state: IState) => state.global.localStorageDb)

  // Functions:
  const renderSwitch = useCallback((extension: IExtension) => {
    switch(extension.type) {
      case EXTENSION_TYPE.MUSIC:
        return <Music _id={ extension._id } />
      case EXTENSION_TYPE.TODO_LIST:
        return <TodoList _id={ extension._id } />
      default:
        return <></>
    }
  }, [])

  const updateLayout = useCallback(async (newLayout: GridLayout.Layout[]) => {
    try {
      if (!isArrayEqual(newLayout, localStorageDb.objectStores.core.layout)) dispatch(updateObjectStore({ layout: newLayout }, OBJECT_STORE.CORE))
    } catch(e) {
      console.error(e)
    }
  }, [ dispatch, localStorageDb.objectStores.core.layout ])

  // Effects:
  useEffect(() => {
    (async () => {
      let isFirstTime = false
      const indexedDB = await openDb('jessyLocalStorageDb', 1, db => {
        isFirstTime = true
        db.createObjectStore(OBJECT_STORE.CORE, { keyPath: 'key', autoIncrement: false })
      })
      if (isFirstTime) await populateNewLocalStorageDb(indexedDB)
      const tx = indexedDB.transaction(OBJECT_STORE.CORE, 'readonly')
      dispatch(updateLocalStorageDb({ db: indexedDB, isFirstTime }))
      dispatch(updateObjectStore({
        extensions: (await tx.objectStore(OBJECT_STORE.CORE).get(OBJECT_STORE_CORE_KEYS.EXTENSIONS)).value as IExtension[],
        layout: (await tx.objectStore(OBJECT_STORE.CORE).get(OBJECT_STORE_CORE_KEYS.LAYOUT)).value as GridLayout.Layout[]
      }, OBJECT_STORE.CORE))
    })()
  }, [ dispatch ])

  // Return:
  return (
    <>
      {
        window.innerWidth >= 1024 ?
        <Wrapper>
          <Background />
          <GridLayoutWithWidth
            className='layout'
            cols={ window.innerWidth / 16 }
            rowHeight={ 16 }
            margin={[ 0, 0 ]}
            isResizable
            isBounded
            preventCollision
            compactType={ null }
            layout={ localStorageDb.objectStores.core.layout }
            onLayoutChange={ layout => updateLayout(layout) }
            draggableCancel='.draggableCancel'
          >
            { localStorageDb.objectStores.core.extensions.map(extension => <span key={ extension._id } >{ renderSwitch(extension) }</span>) }
          </GridLayoutWithWidth>
        </Wrapper>
        :
        <></>
      }
    </>
  )
}


// Exports:
export default App
