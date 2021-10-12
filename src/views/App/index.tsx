// Packages:
import React, { useEffect, useCallback, useState } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { useDispatch, useSelector } from 'react-redux'
import { openDB } from 'idb'
import isArrayEqual from '../../util/isArrayEqual'
import GridLayout, { WidthProvider } from 'react-grid-layout'


// Typescript:
import { IReduxState } from '../../redux/state/types'
import { IExtensionsZIndexes } from '../../redux/state/types/global'
import { IExtension, IIndexedDB, IObjectStoreExtensionMusic, IObjectStoreExtensionTodoList } from '../../indexedDB/types'


// Constants:
import COLORS from '../../styles/colors'
import { OBJECT_STORE, OBJECT_STORE_CORE_IDS, EXTENSION_TYPE } from '../../constants/indexedDB/objectStores'
import { handleIndexedDBUpgrade } from '../../indexedDB'


// Components:
import Music from '../../components/extensions/Music'
import TodoList from '../../components/extensions/TodoList'


// Redux:
import { updateGlobalExtensions, updateGlobalContextMenuRoot } from '../../redux/actions/global'
import { updateIndexedDBObjectStore, updateIndexedDBRoot } from '../../redux/actions/indexedDB'


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
  const indexedDB = useSelector((state: IReduxState) => state.indexedDB)
  const extensions = useSelector((state: IReduxState) => state.global.extensions)
  const [ focusedExtensionID, setFocusedExtensionID ] = useState<string | undefined>(undefined)

  // Functions:
  const onDragStart = useCallback(() => {
    if (focusedExtensionID === undefined) return
    const cursor = extensions.zIndexes[ focusedExtensionID ]
    const newExtensionsZIndexes: IExtensionsZIndexes = {}
    for (let [ _id, currentIndex ] of Object.entries(extensions.zIndexes)) {
      if (currentIndex === cursor) newExtensionsZIndexes[ _id ] = extensions.length - 1
      else if (currentIndex < cursor) newExtensionsZIndexes[ _id ] = currentIndex
      else if (currentIndex > cursor) newExtensionsZIndexes[ _id ] = currentIndex - 1
    }
    dispatch(updateGlobalExtensions({
      ...extensions,
      zIndexes: {
        ...extensions.zIndexes,
        ...newExtensionsZIndexes
      }
    }))
    dispatch(updateGlobalContextMenuRoot({ isActive: false, target: {} }))
  }, [ extensions, dispatch, focusedExtensionID ])

  const onDragStop = useCallback((newLayout: GridLayout.Layout[]) => {
    try {
      newLayout
        .sort(layoutItem => extensions.zIndexes[ layoutItem.i ] - newLayout.indexOf(layoutItem))
        .forEach((layoutItem, index, newLayout) => newLayout[ index ] = { h: layoutItem.h, i: layoutItem.i, w: layoutItem.w, x: layoutItem.x, y: layoutItem.y })
      if (!isArrayEqual(newLayout, indexedDB.objectStores.core.layout)) dispatch(updateIndexedDBObjectStore({ [ OBJECT_STORE_CORE_IDS.LAYOUT ]: newLayout }, OBJECT_STORE.CORE))
    } catch(e) {
      console.error(e)
    }
  }, [ dispatch, extensions.zIndexes, indexedDB.objectStores.core.layout ])

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
        const indexedDB = await openDB<IIndexedDB>('jessyLocalStorageDb', 1, { upgrade: (db, _ov, _nv, transaction) => handleIndexedDBUpgrade(db, transaction) })
        const extensions = ((await indexedDB.transaction(OBJECT_STORE.CORE, 'readonly').store.get(OBJECT_STORE_CORE_IDS.EXTENSIONS))?.value ?? []) as IExtension[]
        const layout = ((await indexedDB.transaction(OBJECT_STORE.CORE, 'readonly').store.get(OBJECT_STORE_CORE_IDS.LAYOUT))?.value ?? []) as GridLayout.Layout[]
        dispatch(updateGlobalExtensions({
          length: layout.length,
          zIndexes: layout.reduce((accumulator, layoutItem, index) => ({ ...accumulator, [ layoutItem.i ]: index }), {})
        }))
        dispatch(updateIndexedDBRoot({ db: indexedDB }))
        dispatch(updateIndexedDBObjectStore({
          [ OBJECT_STORE_CORE_IDS.EXTENSIONS ]: extensions,
          [ OBJECT_STORE_CORE_IDS.LAYOUT ]: layout
        }, OBJECT_STORE.CORE))
        const extensionsTransaction = indexedDB.transaction(OBJECT_STORE.EXTENSIONS, 'readonly')
        dispatch(updateIndexedDBObjectStore({
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
            // layout={ indexedDB.objectStores.core.layout }
            // NOTE: see https://github.com/react-grid-layout/react-grid-layout/issues/1587
            // onLayoutChange={ layout => updateLayout(layout) }
            onDragStart={ onDragStart }
            onDragStop={ onDragStop }
            draggableCancel='.draggableCancel'
          >
            {
              indexedDB.objectStores.core.extensions.map((extension) =>
                <span
                  key={ extension._id }
                  id={ extension._id }
                  data-grid={ indexedDB.objectStores.core.layout.find(layoutItem => layoutItem.i === extension._id) } // NOTE: bad performance, fix later.
                  style={{ zIndex: extensions.zIndexes[ extension._id ] }}
                  onMouseOver={
                    () => {
                      if (focusedExtensionID === undefined || (focusedExtensionID !== undefined && focusedExtensionID !== extension._id)) setFocusedExtensionID(extension._id)
                    }
                  }
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
