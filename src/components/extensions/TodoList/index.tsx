// Packages:
import React, { useState, useCallback, useEffect } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { playButtonPress } from '../../../util/soundEffects'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'


// Typescript:
import { TTask } from '../../../types/taskItem'


// Imports:
import { MdPowerSettingsNew } from 'react-icons/md'


// Components:
import TaskItem from '../../global/TaskItem'
import LCDScreen from '../../global/LCDScreen'


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
const TodoList = () => {
  // State:
  const [ isOn, setIsOn ] = useState(true)
  const [ tasks, setTasks ] = useState<TTask[]>([])
  const [ tasksMetadata, setTasksMetadata ] = useState({
    done: 0,
    length: tasks.length
  })
  const [ LCDCharArray, setLCDCharArray ] = useState<string[]>([])
  const [ taskIndexBeingDragged, setTaskIndexBeingDragged ] = useState<number | undefined>(undefined)

  // Functions:
  const reorderTasks = useCallback((tasks: TTask[], startIndex, endIndex) => {
    const result = Array.from(tasks)
    const [ removed ] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }, [])

  const onDragEnd = useCallback((result) => {
    setTaskIndexBeingDragged(undefined)
    if (!result.destination) return
    setTasks(reorderTasks(
      tasks,
      result.source.index,
      result.destination.index
    ))
  }, [ reorderTasks, tasks ])

  const updateTaskDoneStatus = useCallback((_id: string, newIsDone: boolean) => {
    const newTasks = tasks, taskIndex = newTasks.findIndex(task => task._id === _id)
    newTasks[ taskIndex ] = {
      ...newTasks[ taskIndex ],
      isDone: newIsDone
    }
    setTasks(newTasks)
    if (newIsDone) setTasksMetadata({ ...tasksMetadata, done: tasksMetadata.done + 1 })
    else setTasksMetadata({ ...tasksMetadata, done: tasksMetadata.done - 1 })
  }, [ tasks, tasksMetadata ])

  const addTask = useCallback(() => {
    const newTasks = tasks
    newTasks.unshift({
      _id: (Math.random() + 1).toString(36).substring(2),
      isDone: false,
      time: {
        createdAt: Date.now()
      },
      title: ''
    })
    setTasks(newTasks)
    setTasksMetadata({ ...tasksMetadata, length: tasksMetadata.length + 1 })
  }, [ tasks, tasksMetadata ])

  const deleteTask = useCallback((_id: string) => {
    const newTasks = tasks.filter(task => task._id !== _id), taskToBeDeleted = tasks[ tasks.findIndex(task => task._id === _id) ]
    setTasks(newTasks)
    if (taskToBeDeleted.isDone) setTasksMetadata({ ...tasksMetadata, done: tasksMetadata.done - 1, length: tasksMetadata.length - 1 })
    else setTasksMetadata({ ...tasksMetadata, length: tasksMetadata.length - 1 })
  }, [ tasks, tasksMetadata ])

  // Effects:
  useEffect(() => {
    setLCDCharArray(`Tasks: ${ tasksMetadata.done } Done | ${ tasksMetadata.length - tasksMetadata.done } Left`.toUpperCase().split(''))
  }, [ tasksMetadata.done, tasksMetadata.length ])

  // Return:
  return (
    <Wrapper>
      <InnerContainer>
        <ScreenContainer isOn={ isOn }>
          {
            !isOn && <UntouchabilityLayer />
          }
          <Screen isOn={ isOn } className='draggableCancel'>
            <Scrollbars
              style={{ width: '100%', height: '100%' }}
              renderTrackHorizontal={ props => <div { ...props } style={{ display: 'none' }} className='track-horizontal' /> }
            >
              <DragDropContext
                onDragEnd={ onDragEnd }
                onDragStart={ result => { setTaskIndexBeingDragged(result.source.index) }}
              >
                <Droppable droppableId='droppable'>
                  {(provided, snapshot) => (
                    <Tasks
                      { ...provided.droppableProps }
                      ref={ provided.innerRef }
                    >
                      <AddTask onClick={ addTask }>
                        <Placeholder>add a new task</Placeholder>
                      </AddTask>
                      {
                        tasks.map((task, index) => (
                          <TaskItem
                            index={ index }
                            key={ task._id }
                            task={ task }
                            updateTaskDoneStatus={ updateTaskDoneStatus }
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
              onClick={() => {
                playButtonPress()
                if (isOn) setIsOn(false)
                else setIsOn(true)
              }}
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
