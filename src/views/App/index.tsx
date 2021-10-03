// Packages:
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { openDb } from 'idb'
import GridLayout, { WidthProvider } from 'react-grid-layout'


// Typescript:
import { IExtension, IJessyLocalStorageDb } from './types'


// Constants:
import COLORS from '../../styles/colors'
import { EXTENSION } from '../../constants/extensions'
import populateNewLocalStorageDb from '../../util/populateNewLocalStorageDb'


// Components:
import Music from '../../components/extensions/Music'
import TodoList from '../../components/extensions/TodoList'


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
  // State:
  const [ localStorageDb, setLocalStorageDb ]  = useState<IJessyLocalStorageDb>({
    isFirstTime: false,
    db: null,
    extensions: [],
    layout: []
  })

  // Functions:
  const updateLayout = useCallback(async (newLayout: GridLayout.Layout[]) => {
    try {
      setLocalStorageDb({ ...localStorageDb, layout: newLayout })
      if (!localStorageDb.db) return
      await localStorageDb.db.transaction('core', 'readwrite').objectStore('core').put({ key: 'layout', value: newLayout })
    } catch(e) {
      console.error(e)
    }
  }, [ localStorageDb ])

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
      setLocalStorageDb({
        db: indexedDB,
        isFirstTime,
        extensions: (await tx.objectStore('core').get('extensions')).value as IExtension[],
        layout: (await tx.objectStore('core').get('layout')).value as GridLayout.Layout[]
      })
    })()
  }, [])

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
            {
              // localStorageDb.extensions.length > 0 &&
              // localStorageDb.extensions.map(extension => <span key={ extension._id } >{ EXTENSION[ extension.type ].component({ _id: extension._id }) }</span>)
              localStorageDb.extensions.map(extension => <span key={ extension._id } >{
                (extension.type === EXTENSION['MUSIC'].type && <Music _id={ extension._id } />) ||
                (extension.type === EXTENSION['TODO_LIST'].type && <TodoList _id={ extension._id } />)
              }</span>)
            }
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
