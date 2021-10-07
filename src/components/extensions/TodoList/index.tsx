// Packages:
import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useOuterContextMenu from '../../../hooks/use-outer-context-menu'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { playButtonPress } from '../../../util/soundEffects'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'


// Typescript:
import { IState } from '../../../redux/reducers/types'
import { TTask } from '../../../types/taskItem'
import { IObjectStoreExtensionTodoList } from '../../../indexedDB/types'


// Imports:
import { MdPowerSettingsNew } from 'react-icons/md'


// Constants:
import { OBJECT_STORE, EXTENSION_TYPE } from '../../../constants/indexedDB/objectStores'


// Components:
import TaskItem from '../../global/TaskItem'
import LCDScreen from '../../global/LCDScreen'


// Redux:
import { updateContextTarget, updateObjectStore } from '../../../redux/actions'


// Styles:
import {
  Button,
  Knob,
  LEDLight
} from '../../global/Skeumorphic'

import {
  Wrapper,
  InnerContainer,
  ScreenContainer,
  Screen,
  UntouchabilityLayer,
  Tasks,
  AddTask,
  Placeholder,
  Buttons,
  OuterEdge,
  Name
} from './styles'


// Functions:
const TodoList = ({ _id }: { _id: string }) => {
  // Constants:
  const dispatch = useDispatch()

  // Ref:
  const wrapperRef = useOuterContextMenu((e) => {
    if (contextTarget[ _id ] === true) dispatch(updateContextTarget({ [_id ]: false }))
  })

  // State:
  const localTodoListState = useSelector((state: IState) => state.global.localStorageDb.objectStores.extensions.todo_list[ _id ])
  const contextTarget = useSelector((state: IState) => state.global.contextTarget)
  const [ hasLocalStateLoaded, setHasLocalStateLoaded ] = useState(false)
  const [ isOn, setIsOn ] = useState(true)
  const [ tasks, setTasks ] = useState<TTask[]>([])
  const [ tasksMetadata, setTasksMetadata ] = useState({
    done: 0,
    length: tasks.length
  })
  const [ LCDCharArray, setLCDCharArray ] = useState<string[]>([])
  const [ taskIndexBeingDragged, setTaskIndexBeingDragged ] = useState<number | undefined>(undefined)

  // Functions:
  const onPowerButtonClick = useCallback(() => {
    playButtonPress()
    if (isOn) {
      setIsOn(false)
      dispatch(updateObjectStore({
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
      dispatch(updateObjectStore({
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
    dispatch(updateObjectStore({
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
    dispatch(updateObjectStore({
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
    dispatch(updateObjectStore({
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
    const newTasks = tasks.filter(task => task._id !== _id), taskToBeDeleted = tasks[ tasks.findIndex(task => task._id === _id) ]
    setTasks(newTasks)
    dispatch(updateObjectStore({
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
  }, [ _id, hasLocalStateLoaded, localTodoListState ])

  useEffect(() => {
    setLCDCharArray(`Tasks: ${ tasksMetadata.done } Done | ${ tasksMetadata.length - tasksMetadata.done } Left`.toUpperCase().split(''))
  }, [ tasksMetadata.done, tasksMetadata.length ])

  // Return:
  return (
    <Wrapper
      ref={ wrapperRef }
      onContextMenu={() => { if (!contextTarget[ _id ]) dispatch(updateContextTarget({ [ _id ]: true })) }}
    >
      <InnerContainer className='draggableCancel'>
        <ScreenContainer isOn={ isOn }>
          {
            !isOn && <UntouchabilityLayer />
          }
          <Screen isOn={ isOn }>
            <Scrollbars
              style={{ width: '100%', height: '100%' }}
              renderTrackHorizontal={ props => <div { ...props } style={{ display: 'none' }} className='track-horizontal' /> }
            >
              <DragDropContext
                onDragEnd={ onDragEnd }
                onDragStart={ result => { setTaskIndexBeingDragged(result.source.index) }}
              >
                <Droppable droppableId={ `${ _id }-droppable` }>
                  { provided => (
                    <Tasks
                      { ...provided.droppableProps }
                      ref={ provided.innerRef }
                    >
                      <AddTask onClick={ addTask }>
                        <Placeholder>add a new task</Placeholder>
                      </AddTask>
                      {
                        tasks.filter(task => task.parentID === _id).map((task, index) => (
                          <TaskItem
                            index={ index }
                            key={ task._id }
                            task={ task }
                            updateTask={ updateTask }
                            deleteTask={ deleteTask }
                            taskIndexBeingDragged={ taskIndexBeingDragged }
                          />
                        ))
                      }
                      { provided.placeholder }
                    </Tasks>
                  )}
                </Droppable>
              </DragDropContext>
            </Scrollbars>
          </Screen>
        </ScreenContainer>
        <Buttons>
          <LCDScreen dimensions={{ W: 5, H: 2 }} isOn={ isOn } charArray={ LCDCharArray } />
          <Button style={{ margin: 0 }}>
            <Knob
              selected={ false }
              onClick={ onPowerButtonClick }
            >
              { !isOn ? <MdPowerSettingsNew style={{ color: 'lightseagreen' }} /> : <MdPowerSettingsNew style={{ color: 'palevioletred' }} /> }
            </Knob>
          </Button>
        </Buttons>
      </InnerContainer>
      <OuterEdge>
        <Name>TODO</Name>
        <LEDLight active={ isOn }></LEDLight>
      </OuterEdge>
    </Wrapper>
  )
}


// Exports:
export default TodoList
