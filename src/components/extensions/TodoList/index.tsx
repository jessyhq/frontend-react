// Packages:
import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { playButtonPress } from '../../../util/soundEffects'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'


// Typescript:
import { TTask } from '../../../types/taskItem'


// Imports:
import { MdPowerSettingsNew } from 'react-icons/md'


// Constants:
import COLORS from '../../../styles/colors'
import { SMOOTH_INNER_SHADOW, SMOOTH_SHADOW } from '../../../styles'


// Components:
import TaskItem from '../../global/TaskItem'


// Styles:
import {
  Button,
  Knob,
  LEDLight
} from '../../global/Skeumorphic'
import LCDScreen from '../../global/LCDScreen'

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 25rem;
  height: 35rem;
  margin: 0.75rem;
  padding: 1rem;
  padding-bottom: 0;
  background-color: ${ Color(COLORS.WHITE).darken(0.025).hex() };
  border-radius: 10px;
  box-shadow: ${ SMOOTH_INNER_SHADOW };
  
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 10px;
    box-shadow: ${ SMOOTH_SHADOW };
  }
`

export const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 91%;
  /* margin-top: 5%; */
  padding-bottom: 0.2rem;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px -1px ${ Color(COLORS.WHITE).darken(0.5).hex() }, 0px 0px 5px 0px ${ Color(COLORS.WHITE).darken(0.25).hex() };
  background-color: ${ Color(COLORS.BLACK).lighten(1).hex() };
`

export const ScreenContainer = styled.div<{ isOn: boolean }>`
  position: relative;
  width: 91%;
  height: 73%;
  margin: 3%;
  padding: 1%;
  padding-top: 6%;
  padding-right: 2%;
  background-color: ${ props => props.isOn ? Color(COLORS.WHITE).darken(0.05).hex() : COLORS.BLACK };
  border-radius: 10px;
  box-shadow:
    inset 0px 0px 10px 0px ${ props => props.isOn ? Color(COLORS.WHITE).darken(0.2).saturate(5).hex() : Color(COLORS.WHITE).darken(0.75).hex() },
    0px 0px 5px 0px ${ props => props.isOn ? Color(COLORS.WHITE).darken(0.3).saturate(3).hex() : Color(COLORS.WHITE).darken(0.75).desaturate(0.5).hex() };
  transition: all 0.25s ease;
`

export const UntouchabilityLayer = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`

export const Screen = styled.div<{ isOn: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  filter: ${ props => props.isOn ? 'opacity(1)' : 'opacity(0)' };
  transition: all 0.25s ease;
`

export const Placeholder = styled.div`
  position: relative;
  color: ${ Color(COLORS.WHITE).darken(0.5).hex() };
  font-weight: 500;
  font-size: 1rem;
  user-select: none;
  cursor: pointer;
  transition: all 0.25s ease;
`

export const AddTask = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92%;
  height: 2rem;
  margin-right: 1%;
  margin-bottom: 0.75rem;
  padding: 0.5rem 4%;
  background-color: ${ Color(COLORS.WHITE).darken(0.1).hex() };
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background-color: ${ Color(COLORS.PRIMARY).saturate(0.75).alpha(0.25).toString() };
    transition: all 0.25s ease;
  }

  &:hover ${ Placeholder } {
    color: ${ Color(COLORS.PRIMARY).darken(0.25).toString() };
    transition: all 0.25s ease;
  }
`

export const Tasks = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%;
  margin: auto;
`

export const TaskItemPlaceholder = styled.div`
  display: flex;
  width: 92%;
  min-height: 3rem;
  margin-right: 1%;
  margin-bottom: 0.75rem;
  padding: 0.5rem 4%;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-grow: 0;
  pointer-events: none;
`

export const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  width: 94%;
  height: 12.5%;
  margin: 3%;
`

export const OuterEdge = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  width: 35%;
  height: 5%;
  margin: 2.5% 0%;
  border-radius: 10px;
`

export const Name = styled.div`
  font-size: 1.1rem;
  color: ${ Color(COLORS.WHITE).darken(0.3).hex() };
  user-select: none;
  cursor: default;
`


// Functions:
const TodoList = () => {
  // Constants:
  const LCDScreenDimensions = { W: 5, H: 2 }

  // State:
  const [ isOn, setIsOn ] = useState(true)
  const [ tasks, setTasks ] = useState<TTask[]>(
    [ ...Array(15) ].map((_e, i) => (
      {
      _id: i.toString(),
      isDone: false,
      time: {
        createdAt: Date.now()
      },
      title: `Task #${ i }`
      }
    )
  ))
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
      title: `Task #${ (Math.random() + 1).toString(36).substring(2) }`
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
    setLCDCharArray(`Tasks: ${ tasksMetadata.done } Done, ${ tasksMetadata.length - tasksMetadata.done } Left`.toUpperCase().split(''))
  }, [ tasksMetadata.done, tasksMetadata.length ])

  // Return:
  return (
    <Wrapper>
      <InnerContainer>
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
          <LCDScreen dimensions={ LCDScreenDimensions } isOn={ isOn } charArray={ LCDCharArray } />
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
