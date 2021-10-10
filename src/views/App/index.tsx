// Packages:
import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { useDispatch, useSelector } from 'react-redux'
import { openDB } from 'idb'
import isArrayEqual from '../../util/isArrayEqual'
// import isEqual from 'lodash/isEqual'
import GridLayout, { WidthProvider } from 'react-grid-layout'


// Typescript:
import { IExtensionsZIndex } from './types'
import { IState } from '../../redux/reducers/types'
import { IExtension, IIndexedDB, IObjectStoreExtensionMusic, IObjectStoreExtensionTodoList } from '../../indexedDB/types'


// Constants:
import COLORS from '../../styles/colors'
import { OBJECT_STORE, OBJECT_STORE_CORE_IDS, EXTENSION_TYPE } from '../../constants/indexedDB/objectStores'
import { populateIndexedDB } from '../../indexedDB'


// Components:
import Music from '../../components/extensions/Music'
import TodoList from '../../components/extensions/TodoList'


// Redux:
import { updateLocalStorageDb, updateObjectStore } from '../../redux/actions'


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
  const [ extensionsZIndex, setExtensionsZIndex ] = useState<IExtensionsZIndex>({})
  const [ focusedItemID, setFocusedItemID ] = useState<string | undefined>(undefined)

  // Functions:
  const rearrangeLayout = useCallback(() => {
    if (focusedItemID === undefined) return
    const cursor = extensionsZIndex[ focusedItemID ]
    const newExtensionsZIndex: IExtensionsZIndex = {}
    const extensionsZIndexEntries = Object.entries(extensionsZIndex)
    for (let [ _id, currentIndex ] of extensionsZIndexEntries) {
      if (currentIndex === cursor) newExtensionsZIndex[ _id ] = extensionsZIndexEntries.length - 1
      else if (currentIndex < cursor) newExtensionsZIndex[ _id ] = currentIndex
      else if (currentIndex > cursor) newExtensionsZIndex[ _id ] = currentIndex - 1
    }
    setExtensionsZIndex(newExtensionsZIndex)
  }, [ extensionsZIndex, focusedItemID ])

  const updateRearrangeLayout = useCallback((newLayout: GridLayout.Layout[]) => {
    try {
      newLayout
        .sort(layoutItem => extensionsZIndex[ layoutItem.i ] - newLayout.indexOf(layoutItem))
        .forEach(layoutItem => ({ h: layoutItem.h, i: layoutItem.i, w: layoutItem.w, x: layoutItem.x, y: layoutItem.y }))
      if (!isArrayEqual(newLayout, localStorageDb.objectStores.core.layout)) dispatch(updateObjectStore({ [ OBJECT_STORE_CORE_IDS.LAYOUT ]: newLayout }, OBJECT_STORE.CORE))
    } catch(e) {
      console.error(e)
    }
  }, [dispatch, extensionsZIndex, localStorageDb.objectStores.core.layout])

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

  // Effects:
  useEffect(() => {
    (async () => {
      try {
        let isFirstTime = false
        const indexedDB = await openDB<IIndexedDB>('jessyLocalStorageDb', 1, {
          upgrade: (db) => {
            isFirstTime = true
            db.createObjectStore(OBJECT_STORE.CORE, { keyPath: '_id', autoIncrement: false })
            db.createObjectStore(OBJECT_STORE.EXTENSIONS, { keyPath: '_id', autoIncrement: false })
          }
        })
        if (isFirstTime) await populateIndexedDB(indexedDB)
        const extensions = ((await indexedDB.transaction(OBJECT_STORE.CORE, 'readonly').store.get(OBJECT_STORE_CORE_IDS.EXTENSIONS))?.value ?? []) as IExtension[]
        const layout = ((await indexedDB.transaction(OBJECT_STORE.CORE, 'readonly').store.get(OBJECT_STORE_CORE_IDS.LAYOUT))?.value ?? []) as GridLayout.Layout[]
        setExtensionsZIndex(layout.reduce((accumulator, layoutItem, index) => ({ ...accumulator, [ layoutItem.i ]: index }), {}))
        dispatch(updateLocalStorageDb({ db: indexedDB, isFirstTime }))
        dispatch(updateObjectStore({
          [ OBJECT_STORE_CORE_IDS.EXTENSIONS ]: extensions,
          [ OBJECT_STORE_CORE_IDS.LAYOUT ]: layout
        }, OBJECT_STORE.CORE))
        const extensionsTransaction = indexedDB.transaction(OBJECT_STORE.EXTENSIONS, 'readonly')
        dispatch(updateObjectStore({
          [ EXTENSION_TYPE.MUSIC ]: ((await extensionsTransaction.store.get(EXTENSION_TYPE.MUSIC))?.value ?? {}) as IObjectStoreExtensionMusic,
          [ EXTENSION_TYPE.TODO_LIST ]: ((await extensionsTransaction.store.get(EXTENSION_TYPE.TODO_LIST))?.value ?? {}) as IObjectStoreExtensionTodoList
        }, OBJECT_STORE.EXTENSIONS))
      } catch(e) {
        console.error(e)
      }
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
            // @ts-ignore TODO: remove ts-ignore when PR https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56400 is merged
            allowOverlap
            preventCollision
            compactType={ null }
            layout={ localStorageDb.objectStores.core.layout }
            // NOTE: see https://github.com/react-grid-layout/react-grid-layout/issues/1587
            // onLayoutChange={ layout => updateLayout(layout) }
            onDragStart={ rearrangeLayout }
            onDragStop={ updateRearrangeLayout }
            draggableCancel='.draggableCancel'
          >
            {
              localStorageDb.objectStores.core.extensions.map((extension) =>
                <span
                  key={ extension._id }
                  id={ extension._id }
                  style={{ zIndex: extensionsZIndex[ extension._id ] }}
                  onMouseOver={ () => { if (focusedItemID === undefined || (focusedItemID !== undefined && focusedItemID !== extension._id)) setFocusedItemID(extension._id) } }
                >{ renderSwitch(extension) }</span>
              )
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
