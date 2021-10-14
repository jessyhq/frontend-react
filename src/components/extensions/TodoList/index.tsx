// Packages:
import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useOuterContextMenu from '../../../hooks/use-outer-context-menu'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { playButtonPress } from '../../../util/soundEffects'
import { useDebounce, useUnmount } from 'react-use'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'


// Typescript:
import { IReduxState } from '../../../redux/state/types'
import { TTask } from '../../../types/taskItem'
import { IObjectStoreExtensionTodoList } from '../../../indexedDB/types'


// Constants:
import { OBJECT_STORE, EXTENSION_TYPE } from '../../../constants/indexedDB/objectStores'


// Components:
import WindowControls from '../../global/WindowControls'
import TaskItem from '../../global/TaskItem'


// Redux:
import { updateGlobalContextMenuTarget } from '../../../redux/actions/global'
import { updateIndexedDBObjectStore } from '../../../redux/actions/indexedDB'


// Styles:
import {
  Wrapper,
  TopBarTitle,
  MainArea,
  SearchBar,
  SearchInput,
  SearchIcon,
  OptionsBar,
  ActionButton,
  OptionsIcon,
  ProjectsArea,
  Project,
  ProjectTitle,
  Board,
  BoardTitle,
  RightArrow,
  ItemCount,
  LastEdited,
  TopBar,
  BottomBar
} from './styles'

interface IInternalRouteHistoryObject {
  _id: string
  icon: string
  name: string
}

// Functions:
const TodoList = ({ _id }: { _id: string }) => {
  // Constants:
  const dispatch = useDispatch()

  // Ref:
  const wrapperRef = useOuterContextMenu((e) => {
    if (contextTarget[ _id ] === EXTENSION_TYPE.TODO_LIST) dispatch(updateGlobalContextMenuTarget({ [_id ]: undefined }))
  })

  // State:
  const localTodoListState = useSelector((state: IReduxState) => state.indexedDB.objectStores.extensions.todo_list[ _id ])
  const contextTarget = useSelector((state: IReduxState) => state.global.contextMenu.target)
  const [ internalRouteHistory, setInternalRouteHistory ] = useState<IInternalRouteHistoryObject[]>([])
  const [ level, setLevel ] = useState(1)
  const [ hasLocalStateLoaded, setHasLocalStateLoaded ] = useState(false)
  const [ isOn, setIsOn ] = useState(true)
  const [ tasks, setTasks ] = useState<TTask[]>([])
  const [ tasksMetadata, setTasksMetadata ] = useState({
    done: 0,
    length: tasks.length
  })
  const [ taskIndexBeingDragged, setTaskIndexBeingDragged ] = useState<number | undefined>(undefined)

  // Functions:
  const onPowerButtonClick = useCallback(() => {
    playButtonPress()
    if (isOn) {
      setIsOn(false)
      dispatch(updateIndexedDBObjectStore({
        [ EXTENSION_TYPE.TODO_LIST ]: {
          [ _id ]: {
            ...localTodoListState,
            isOn: false,
            time: {
              ...localTodoListState.time,
              lastEdited: Date.now()
            }
          }
        } as IObjectStoreExtensionTodoList
      }, OBJECT_STORE.EXTENSIONS))
    } else {
      setIsOn(true)
      dispatch(updateIndexedDBObjectStore({
        [ EXTENSION_TYPE.TODO_LIST ]: {
          [ _id ]: {
            ...localTodoListState,
            isOn: true,
            time: {
              ...localTodoListState.time,
              lastEdited: Date.now()
            }
          }
        } as IObjectStoreExtensionTodoList
      }, OBJECT_STORE.EXTENSIONS))
    }
  }, [ _id, dispatch, isOn, localTodoListState ])

  const reorderTasks = useCallback((tasks: TTask[], startIndex, endIndex) => {
    const newTasks = Array.from(tasks)
    const [ removed ] = newTasks.splice(startIndex, 1)
    newTasks.splice(endIndex, 0, removed)
    dispatch(updateIndexedDBObjectStore({
      [ EXTENSION_TYPE.TODO_LIST ]: {
        [ _id ]: {
          ...localTodoListState,
          tasks: newTasks,
          time: {
            ...localTodoListState.time,
            lastEdited: Date.now()
          }
        }
      } as IObjectStoreExtensionTodoList
    }, OBJECT_STORE.EXTENSIONS))
    return newTasks
  }, [ _id, dispatch, localTodoListState ])

  const onDragEnd = useCallback((result) => {
    setTaskIndexBeingDragged(undefined)
    if (!result.destination) return
    setTasks(reorderTasks(
      tasks,
      result.source.index,
      result.destination.index
    ))
  }, [ reorderTasks, tasks ])

  const updateTask = useCallback((taskID: string, newTask: Partial<TTask>) => {
    const newTasks = tasks, taskIndex = newTasks.findIndex(task => task._id === taskID)
    newTasks[ taskIndex ] = { ...newTasks[ taskIndex ], ...newTask }
    setTasks(newTasks)
    dispatch(updateIndexedDBObjectStore({
      [ EXTENSION_TYPE.TODO_LIST ]: {
        [ _id ]: {
          ...localTodoListState,
          tasks: newTasks,
          time: {
            ...localTodoListState.time,
            lastEdited: Date.now()
          }
        }
      } as IObjectStoreExtensionTodoList
    }, OBJECT_STORE.EXTENSIONS))
    if (newTask.isDone !== undefined) {
      if (newTask.isDone) setTasksMetadata({ ...tasksMetadata, done: tasksMetadata.done + 1 })
      else setTasksMetadata({ ...tasksMetadata, done: tasksMetadata.done - 1 })
    }
  }, [ _id, dispatch, localTodoListState, tasks, tasksMetadata ])

  const addTask = useCallback(() => {
    const newTasks = tasks
    newTasks.unshift({
      _id: (Math.random() + 1).toString(36).substring(2),
      isDone: false,
      parentID: _id,
      time: {
        createdAt: Date.now(),
        lastEdited: Date.now()
      },
      title: ''
    })
    setTasks(newTasks)
    dispatch(updateIndexedDBObjectStore({
      [ EXTENSION_TYPE.TODO_LIST ]: {
        [ _id ]: {
          ...localTodoListState,
          tasks: newTasks,
          time: {
            ...localTodoListState.time,
            lastEdited: Date.now()
          }
        }
      } as IObjectStoreExtensionTodoList
    }, OBJECT_STORE.EXTENSIONS))
    setTasksMetadata({ ...tasksMetadata, length: tasksMetadata.length + 1 })
  }, [ _id, dispatch, localTodoListState, tasks, tasksMetadata ])

  const deleteTask = useCallback((taskID: string) => {
    const newTasks = tasks.filter(task => task._id !== taskID), taskToBeDeleted = tasks[ tasks.findIndex(task => task._id === taskID) ]
    setTasks(newTasks)
    dispatch(updateIndexedDBObjectStore({
      [ EXTENSION_TYPE.TODO_LIST ]: {
        [ _id ]: {
          ...localTodoListState,
          tasks: newTasks,
          time: {
            ...localTodoListState.time,
            lastEdited: Date.now()
          }
        }
      } as IObjectStoreExtensionTodoList
    }, OBJECT_STORE.EXTENSIONS))
    if (taskToBeDeleted.isDone) setTasksMetadata({ ...tasksMetadata, done: tasksMetadata.done - 1, length: tasksMetadata.length - 1 })
    else setTasksMetadata({ ...tasksMetadata, length: tasksMetadata.length - 1 })
  }, [ _id, dispatch, localTodoListState, tasks, tasksMetadata ])

  // Effects:
  useEffect(() => {
    if (localTodoListState && !hasLocalStateLoaded) {
      setIsOn(localTodoListState.isOn)
      setTasks(localTodoListState.tasks)
      setTasksMetadata({
        done: localTodoListState.tasks.filter(task => task.isDone).length,
        length: localTodoListState.tasks.length
      })
      setHasLocalStateLoaded(true)
    }
  }, [ _id, contextTarget, dispatch, hasLocalStateLoaded, localTodoListState ])

  useDebounce(() => setLevel(internalRouteHistory.length), 250, [ internalRouteHistory ])

  useUnmount(() => { if (contextTarget[ _id ] !== undefined) dispatch(updateGlobalContextMenuTarget({ [ _id ]: undefined })) })

  // Return:
  return (
    <Wrapper
      ref={ wrapperRef }
      onContextMenu={() => { if (!contextTarget[ _id ]) dispatch(updateGlobalContextMenuTarget({ [ _id ]: EXTENSION_TYPE.TODO_LIST })) }}
    >
      <TopBar>
        <TopBarTitle><span style={{ marginRight: '0.25rem' }}>✨</span><span>projects</span></TopBarTitle>
        <WindowControls />
      </TopBar>
      <MainArea className='draggableCancel'>
        <SearchBar>
          <SearchIcon />
          <SearchInput type='text' placeholder='search for a project or a board' />
        </SearchBar>
        <OptionsBar>
          <ActionButton isEnabled={ true }>
            + add a new project
          </ActionButton>
          <OptionsIcon />
        </OptionsBar>
        {
          level === 0
          &&
          <ProjectsArea style={{ marginLeft: internalRouteHistory.length === 0 ? '0' : '-100%' }}>
            <Project style={{ marginTop: 0 }}>
              <ProjectTitle><span style={{ marginRight: '0.25rem' }}>🎈</span><span>school</span></ProjectTitle>
              <Board onClick={ () => setInternalRouteHistory([ ...internalRouteHistory, { _id: 'chemistry', icon: '⚗️', name: 'chemistry' } ]) }>
                <BoardTitle><span style={{ marginRight: '0.25rem' }}>⚗️</span><span>chemistry</span></BoardTitle>
                <RightArrow />
              </Board>
              <Board onClick={ () => setInternalRouteHistory([ ...internalRouteHistory, { _id: 'chemistry', icon: '✍️', name: 'literature' } ]) }>
                <BoardTitle><span style={{ marginRight: '0.25rem' }}>✍️️</span><span>literature</span></BoardTitle>
                <RightArrow />
              </Board>
            </Project>
          </ProjectsArea>
        }
        {
          level === 1
          &&
          <></>
        }
      </MainArea>
      <BottomBar>
        <ItemCount>2 projects</ItemCount>
        <LastEdited>last edited at 7:20 PM</LastEdited>
      </BottomBar>
    </Wrapper>
  )
}


// Exports:
export default TodoList
