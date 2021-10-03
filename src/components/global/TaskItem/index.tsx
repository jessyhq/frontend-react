// Packages:
import React, { useState, useRef, useCallback, useEffect } from 'react'
import Color from 'color'
import { Draggable } from 'react-beautiful-dnd'
import { select as d3Select } from 'd3-selection'
import { transition as d3Transition } from 'd3-transition'
import { line, curveCardinal } from 'd3-shape'
import { getWidthOfText } from '../../../util/getWidthOfText'
import useTimeout from '../../../hooks/use-timeout'
import { playStrikeThrough } from '../../../util/soundEffects'


// Typescript:
import { ITaskItemProps } from './types'


// Constants:
import COLORS from '../../../styles/colors'
import { generateRandomTaskName } from '../../../util/generateRandomTaskName'
import { useInput } from '../../../hooks/use-input'


// Styles:
import {
  Wrapper,
  GrabHandle,
  HalfGrabIcon,
  Edge,
  Checkbox,
  CheckmarkIcon,
  Middle,
  LineSVG,
  TitleInput,
  Title,
  OptionsEdge,
  DoneIcon,
  EditIcon,
  DeleteIcon,
  BoxShadow
} from './styles'


// Functions:
d3Select.prototype.transition = d3Transition

const TaskItem = ({ index, task, updateTaskDoneStatus, deleteTask, taskIndexBeingDragged }: ITaskItemProps) => {
  // Ref:
  const middleRef = useRef<HTMLDivElement | null>(null)
  const lineSVGRef = useRef<SVGSVGElement | null>(null)

  // State:
  const [ mountStatus, setMountStatus ] = useState<-1 | 0 | 1 | 2>(-1)
  const [ isTaskDone, setIsTaskDone ] = useState(task.isDone)
  const [ canToggleTaskDone, setCanToggleTaskDone ] = useState(true)
  const [ isTaskDeleted, setIsTaskDeleted ] = useState({ transitionSet: false, shouldTransition: false, transitioned: false })
  const [ scribble, setScribble ] = useState<undefined | any>()
  const [ scribbleDimensions, setScribbleDimensions ] = useState({ width: 0, height: 0 })
  const [ scribblePathLength, setScribblePathLength ] = useState(0)
  const [ isScribbleDrawn, setIsScribbleDrawn ] = useState<{ current: boolean, previous: boolean | undefined }>({ current: false, previous: undefined })
  const [ isEditing, setIsEditing ] = useState(task.title === '')
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
  useEffect(() => {
    setMountStatus(0)
  }, [])

  useTimeout(() => {
    setMountStatus(1)
  }, 500)

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
          index={ index }
          mountStatus={ mountStatus }
          isTaskDeleted={ isTaskDeleted }
        >
          <GrabHandle { ...provided.dragHandleProps }>
            <HalfGrabIcon style={{ marginLeft: '-1.3rem' }} />
            <HalfGrabIcon />
          </GrabHandle>
          <Edge>
            <Checkbox
              isChecked={ isTaskDone }
              isClickable={ !isEditing }
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
                <TitleInput type='text' placeholder={ titlePlaceHolder } { ...bindTaskTitle } autoFocus={ isEditing } />
              :
                <Title isStrikethrough={ isTaskDone }>{ taskTitle }</Title>
            }
          </Middle>
          <OptionsEdge shouldHideWhenNotHovering={ isEditing }>
            {
              isEditing ?
                <DoneIcon isvisible={ `${ taskTitle.length > 0 }` } onClick={ () => taskTitle.length > 0 ? setIsEditing(false) : null } />
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
