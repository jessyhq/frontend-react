// Packages:
import React, { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { useDispatch, useSelector } from 'react-redux'
import { openDb } from 'idb'
import GridLayout, { WidthProvider } from 'react-grid-layout'


// Typescript:
import { IExtension } from './types'


// Constants:
import COLORS from '../../styles/colors'
import { EXTENSION_TYPE } from '../../constants/extensions'
import populateNewLocalStorageDb from '../../util/populateNewLocalStorageDb'


// Components:
import Music from '../../components/extensions/Music'
import TodoList from '../../components/extensions/TodoList'


// Redux:
import { updateLocalStorageDb } from '../../redux/actions'
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
      dispatch(updateLocalStorageDb({ layout: newLayout }))
      if (!localStorageDb.db) return
      await localStorageDb.db.transaction('core', 'readwrite').objectStore('core').put({ key: 'layout', value: newLayout })
    } catch(e) {
      console.error(e)
    }
  }, [ dispatch, localStorageDb ])

  // Effects:
  useEffect(() => {
    (async () => {
      let isFirstTime = false
      const indexedDB = await openDb('jessyLocalStorageDb', 1, db => {
        isFirstTime = true
        db.createObjectStore('core', { keyPath: 'key', autoIncrement: false })
      })
      if (isFirstTime) await populateNewLocalStorageDb(indexedDB)
      const tx = indexedDB.transaction('core', 'readonly')
      const newLocalStorageDb = {
        db: indexedDB,
        isFirstTime,
        extensions: (await tx.objectStore('core').get('extensions')).value as IExtension[],
        layout: (await tx.objectStore('core').get('layout')).value as GridLayout.Layout[]
      }
      dispatch(updateLocalStorageDb(newLocalStorageDb))
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
            layout={ localStorageDb.layout }
            onLayoutChange={ layout => updateLayout(layout) }
            draggableCancel='.draggableCancel'
          >
            { localStorageDb.extensions.map(extension => <span key={ extension._id } >{ renderSwitch(extension) }</span>) }
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
