// Packages:
import React, { useState, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { Draggable } from 'react-beautiful-dnd'
import { select as d3Select } from 'd3-selection'
import { transition as d3Transition } from 'd3-transition'
import { line, curveCardinal } from 'd3-shape'
import { getWidthOfText } from '../../../util/getWidthOfText'
import useTimeout from '../../../hooks/use-timeout'
import { playStrikeThrough } from '../../../util/soundEffects'


// Typescript:
import { TTask } from '../../../types/taskItem'


// Imports:
import { ImCheckmark } from 'react-icons/im'
import { MdMoreVert, MdModeEdit, MdDelete } from 'react-icons/md'


// Constants:
import COLORS from '../../../styles/colors'
import { generateRandomTaskName } from '../../../util/generateRandomTaskName'
import { useInput } from '../../../hooks/use-input'


d3Select.prototype.transition = d3Transition


// Styles:
export const Edge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7%;
  height: 100%;
`

export const OptionsEdge = styled(Edge)<{ shouldHideWhenNotHovering: boolean }>`
  filter: ${ props => props.shouldHideWhenNotHovering ? 'opacity(0)' : 'opacity(1)' };
  transition: all 0.25s ease;
`

export const Wrapper = styled.div<{ isTaskDeleted: { transitionSet: boolean, shouldTransition: boolean, transitioned: boolean } }>`
  display: flex;
  align-items: center;
  width: 92%;
  height: 2rem;
  margin-right: 1%;
  margin-bottom: ${ props => props.isTaskDeleted.shouldTransition ? '-3rem' : '0.75rem' };
  padding: 0.5rem 4%;
  background-color: ${ COLORS.WHITE };
  border-radius: 15px;
  filter: ${ props => props.isTaskDeleted.shouldTransition ? 'opacity(0)' : 'opacity(1)' };
  transform: ${ props => props.isTaskDeleted.transitionSet ? props.isTaskDeleted.shouldTransition ? 'scale(0.9) !important' : 'scale(1) !important' : '' };
  transition: ${
    props => props.isTaskDeleted.transitionSet ?
      props.isTaskDeleted.shouldTransition ?
        'all 0.25s ease !important'
      :
        'all 0s !important'
    :
      ''
  };

  &:hover ${ OptionsEdge } {
    filter: opacity(1);
    transition: all 0.25s ease;
  }
`

export const HalfGrabIcon = styled(MdMoreVert)`
  position: absolute;
  width: 1.25rem;
  height: 3rem;
  margin-left: -0.5rem;
  color: ${ Color(COLORS.WHITE).darken(0.75).alpha(0.4).toString() };
  user-select: none;
  transition: all 0.25s ease;
`

export const GrabHandle = styled(Edge)`
  width: 6%;
  margin-left: 1%;
  pointer-events: auto;
  transition: all 0.25s ease, transform 0s;

  &:hover ${ HalfGrabIcon } {
    color: ${ Color(COLORS.WHITE).darken(0.75).toString() };
    transition: all 0.25s ease;
  }

  &:active:hover ${ HalfGrabIcon } {
    color: ${ Color(COLORS.WHITE).darken(0.75).toString() };
    transition: all 0.25s ease;
  }

  &:active:hover {
    cursor: grabbing;
  }
`

export const CheckmarkIcon = styled(ImCheckmark)<{ isvisible: string }>`
  font-size: 0.75rem;
  margin-right: 1px;
  color: ${ props => props.isvisible === 'true' ? Color(COLORS.WHITE).darken(0.75).toString() : Color(COLORS.WHITE).darken(0.75).alpha(0.25).toString() };
  transition: all 0.25s ease;
`

export const Checkbox = styled.div<{ isChecked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 5px;
  background-color: ${ Color(COLORS.WHITE).darken(0.25).alpha(0.5).toString() };
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    box-shadow: inset 0px 0px 5px 0px ${ Color(COLORS.WHITE).darken(0.25).hex() };
    transition: all 0.25s ease;
  }

  &:hover ${ CheckmarkIcon } {
    color: ${ props => props.isChecked ? Color(COLORS.WHITE).darken(0.75).toString() : Color(COLORS.WHITE).darken(0.75).alpha(0.5).toString() };
    transition: all 0.25s ease;
  }
`

export const Middle = styled.div`
  display: flex;
  align-items: center;
  width: 73%;
  height: 100%;
  margin: 0 3%;
  font-weight: 500;
  color: ${ COLORS.BLACK };
`

export const LineSVG = styled.svg`
  position: absolute;
  z-index: -1;
  max-width: 67%;
`

export const TitleInput = styled.input`
  margin-left: -1%;
  font-weight: 500;
  font-size: 1rem;
  background-color: transparent;
  border: none;
  outline: none;
`

export const Title = styled.div<{ isStrikethrough: boolean }>`
  position: relative;
  color: ${ props => props.isStrikethrough ? Color(COLORS.WHITE).darken(0.75).alpha(0.6).toString() : 'inherit' };
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  cursor: default;
  transition: all 0.25s ease;
`

export const DoneIcon = styled(ImCheckmark)<{ isvisible: string }>`
  position: absolute;
  margin-bottom: ${ props => props.isvisible === 'true' ? '0rem' : '-0.5rem' };
  font-size: ${ props => props.isvisible === 'true' ? '1.25rem' : '0rem' };
  color: ${ Color(COLORS.WHITE).darken(0.75).alpha(0.4).toString() };
  user-select: none;
  cursor: pointer;
  transition: color 0.25s ease, margin 0.5s ease, font-size 0.5s ease;

  &:hover {
    color: lightseagreen;
    transition: all 0.25s ease;
  }
`

export const EditIcon = styled(MdModeEdit)<{ isvisible: string }>`
  position: absolute;
  margin-left: ${ props => props.isvisible === 'true' ? '0rem' : '-2rem' };
  font-size: ${ props => props.isvisible === 'true' ? '1.25rem' : '0rem' };
  color: ${ Color(COLORS.WHITE).darken(0.75).alpha(0.4).toString() };
  user-select: none;
  cursor: pointer;
  transition: color 0.25s ease, margin 0.5s ease, font-size 0.5s ease;

  &:hover {
    color: ${ Color(COLORS.WHITE).darken(0.75).toString() };
    transition: all 0.25s ease;
  }
`

export const DeleteIcon = styled(MdDelete)<{ isvisible: string }>`
  position: absolute;
  margin-right: ${ props => props.isvisible === 'true' ? '0rem' : '-2rem' };
  font-size: ${ props => props.isvisible === 'true' ? '1.25rem' : '0rem' };
  color: ${ Color(COLORS.WHITE).darken(0.75).alpha(0.4).toString() };
  user-select: none;
  cursor: pointer;
  transition: color 0.25s ease, margin 0.5s ease, font-size 0.5s ease;

  &:hover {
    color: palevioletred;
    transition: all 0.25s ease;
  }
`

export const BoxShadow = styled.span`
  position: absolute;
  z-index: -1;
  left: 0%;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transition: all 0.25s ease;
`


// Functions:
const TaskItem = (
  {
    index,
    task,
    updateTaskDoneStatus,
    deleteTask,
    taskIndexBeingDragged,
  }: {
    index: number
    task: TTask
    updateTaskDoneStatus: (_id: string, newIsDone: boolean) => void
    deleteTask: (_id: string) => void
    taskIndexBeingDragged?: number
  }) => {
  // Ref:
  const middleRef = useRef<HTMLDivElement | null>(null)
  const lineSVGRef = useRef<SVGSVGElement | null>(null)

  // State:
  const [ isTaskDone, setIsTaskDone ] = useState(task.isDone)
  const [ canToggleTaskDone, setCanToggleTaskDone ] = useState(true)
  const [ isTaskDeleted, setIsTaskDeleted ] = useState({ transitionSet: false, shouldTransition: false, transitioned: false })
  const [ scribble, setScribble ] = useState<undefined | any>()
  const [ scribbleDimensions, setScribbleDimensions ] = useState({ width: 0, height: 0 })
  const [ scribblePathLength, setScribblePathLength ] = useState(0)
  const [ isScribbleDrawn, setIsScribbleDrawn ] = useState<{ current: boolean, previous: boolean | undefined }>({ current: false, previous: undefined })
  const [ isEditing, setIsEditing ] = useState(false)
  const { value: taskTitle, bind: bindTaskTitle } = useInput(task.title)
  const [ oldTaskTitle, setOldTaskTitle ] = useState<string | undefined>(undefined)
  const [ titlePlaceHolder, setTitlePlaceHolder ] = useState(generateRandomTaskName())

  // Functions:
  const generateScribble = useCallback(({ width, height }: { width: number, height: number }) => {
    let pathLength: number
    const points: [ number, number ][] =
      [ ...Array( Math.min(width, middleRef.current?.getBoundingClientRect().width ?? 220) / 5) ].map((_e, i) => [ i * 5, Math.floor(Math.random() * height) ])
    const curve = d3Select(lineSVGRef.current)
      .selectAll('path')
      .data([points[points.length - 1]])
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', Color(COLORS.WHITE).darken(0.75).alpha(0.5).toString())
            .attr('stroke-width', 2.5)
            .attr('shape-rendering', 'geometricPrecision')
            .attr('d', line().curve(curveCardinal)(points))
            .attr('stroke-dasharray', function () {
              setScribblePathLength(this.getTotalLength())
              pathLength = this.getTotalLength()
              return this.getTotalLength()
            })
            .attr('stroke-dashoffset', pathLength)
      )
    setScribble(curve)
  }, [])

  // Effects:
  // useEffect(() => {
  //   const rawScribbleWidth = getWidthOfText(taskTitle, 'Roboto', `${ 16 + (0.5 * 2) }px`)
  //   setScribbleDimensions({ width: Math.min(rawScribbleWidth, middleRef.current?.getBoundingClientRect().width ?? 220), height: 10 })
  //   generateScribble({ width: Math.min(rawScribbleWidth, middleRef.current?.getBoundingClientRect().width ?? 220), height: 10 })
  // }, [ generateScribble, taskTitle ])

  useEffect(() => {
    if (!isEditing && taskTitle !== oldTaskTitle) {
      setOldTaskTitle(taskTitle)
      setTitlePlaceHolder(generateRandomTaskName())
      const rawScribbleWidth = getWidthOfText(taskTitle, 'Roboto', `${ 16 + (0.5 * 2) }px`)
      setScribbleDimensions({ width: Math.min(rawScribbleWidth, middleRef.current?.getBoundingClientRect().width ?? 220), height: 10 })
      if (scribble !== undefined) scribble.remove()
      generateScribble({ width: Math.min(rawScribbleWidth, middleRef.current?.getBoundingClientRect().width ?? 220), height: 10 })
    }
  }, [ generateScribble, isEditing, oldTaskTitle, scribble, taskTitle ])

  useEffect(() => {
    if (isScribbleDrawn.current === true && isScribbleDrawn.previous === false && isTaskDone === false && scribble !== undefined) {
      setCanToggleTaskDone(false);
      (async () => {
        playStrikeThrough()
        await scribble
          .attr('stroke-dashoffset', 0)
          .transition()
          .duration(500)
          .attr('stroke-dashoffset', scribblePathLength)
          .end()
        scribble.remove()
        setIsScribbleDrawn({ current: false, previous: true })
        generateScribble(scribbleDimensions)
        setCanToggleTaskDone(true)
      })()
    } else if (isScribbleDrawn.current === false && isTaskDone === true && scribble !== undefined) {
      setCanToggleTaskDone(false);
      (async () => {
        playStrikeThrough()
        await scribble
          .attr('stroke-dashoffset', scribblePathLength)
          .transition()
          .duration(500)
          .attr('stroke-dashoffset', 0)
          .end()
        setIsScribbleDrawn({ current: true, previous: false })
        setCanToggleTaskDone(true)
      })()
    }
  }, [ generateScribble, isScribbleDrawn, isTaskDone, scribble, scribbleDimensions, scribblePathLength ])

  useEffect(() => {
    if (isTaskDeleted.transitioned) {
      deleteTask(task._id)
    }
  }, [ deleteTask, isTaskDeleted.transitioned, task._id ])

  useTimeout(() => {
    if (isTaskDeleted.transitionSet && !isTaskDeleted.shouldTransition && !isTaskDeleted.transitioned) {
      setIsTaskDeleted({ ...isTaskDeleted, shouldTransition: true })
    }
  }, 1)

  useTimeout(() => {
    if (isTaskDeleted.shouldTransition) {
      setIsTaskDeleted({ ...isTaskDeleted, transitioned: true })
    }
  }, 250 + 1)
  
  // Return:
  return (
    <Draggable key={ task._id } draggableId={ task._id } index={ index }>
      {(provided, snapshot) => (
        <Wrapper
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          style={
            {
              ...provided.draggableProps.style,
              position: 'static',
              transform: (() => {
                if (taskIndexBeingDragged === undefined) return 'translate(0px, 0px)'
                return snapshot.isDragging ?
                  provided.draggableProps.style?.transform
                :
                  (index > taskIndexBeingDragged) ?
                    provided.draggableProps.style?.transform === 'translate(0px, 60px)' ?
                      ''
                    :
                      'translate(0px, -60px)'
                  :
                    (index < taskIndexBeingDragged) ?
                      provided.draggableProps.style?.transform === null ?
                        ''
                      :
                        'translate(0px, 60px)'
                    :
                    ''
              })()
            }
          }
          isTaskDeleted={ isTaskDeleted }
        >
          <GrabHandle { ...provided.dragHandleProps }>
            <HalfGrabIcon style={{ marginLeft: '-1.3rem' }} />
            <HalfGrabIcon />
          </GrabHandle>
          <Edge>
            <Checkbox
              isChecked={ isTaskDone }
              onClick={() => {
                if (!isEditing && canToggleTaskDone) {
                  setIsTaskDone(!isTaskDone)
                  updateTaskDoneStatus(task._id, !isTaskDone)
                }
              }}
            >
              <CheckmarkIcon isvisible={ `${ isTaskDone }` } />
            </Checkbox>
          </Edge>
          <Middle ref={ middleRef }>
            <LineSVG
              ref={ lineSVGRef }
              width={ scribbleDimensions.width + 5 }
              height={ scribbleDimensions.height * 2 }
              viewBox={ `0 0 ${ scribbleDimensions.width - 5 > 0 ? scribbleDimensions.width - 5 : scribbleDimensions.width } ${ scribbleDimensions.height }` }
              preserveAspectRatio='xMidYMid meet'
            />
            {
              isEditing ?
                <TitleInput type='text' placeholder={ titlePlaceHolder } { ...bindTaskTitle } />
              :
                <Title isStrikethrough={ isTaskDone }>{ taskTitle }</Title>
            }
          </Middle>
          <OptionsEdge shouldHideWhenNotHovering={ isEditing }>
            {
              isEditing ?
                <DoneIcon isvisible={ `${ taskTitle.length > 0 }` } onClick={ () => setIsEditing(false) } />
              :
                <EditIcon isvisible={ `${ !isTaskDone }` } onClick={
                    () => {
                      setOldTaskTitle(taskTitle)
                      setIsEditing(true)
                    }
                  }
                />
            }
            <DeleteIcon isvisible={ `${ isTaskDone }` } onClick={ () => setIsTaskDeleted({ ...isTaskDeleted, transitionSet: true }) } />
          </OptionsEdge>
          <BoxShadow style={{ boxShadow: snapshot.isDragging ? `0px 1px 10px -5px ${ Color(COLORS.WHITE).darken(0.25).hex() }` : '' }} />
        </Wrapper>
      )}
    </Draggable>
  )
}


// Exports:
export default TaskItem
