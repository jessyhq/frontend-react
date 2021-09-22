// Packages:
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { select as d3Select } from 'd3-selection'
import { transition as d3Transition } from 'd3-transition'
import { line, curveCardinal } from 'd3-shape'
import { getWidthOfText } from '../../../util/getWidthOfText'
import { playStrikeThrough } from '../../../util/soundEffects'


// Typescript:
import { TTask } from '../../../types/taskItem'


// Imports:
import { ImCheckmark } from 'react-icons/im'
import { MdMoreVert, MdModeEdit, MdDelete } from 'react-icons/md'


// Constants:
import COLORS from '../../../styles/colors'
d3Select.prototype.transition = d3Transition


// Styles:
export const Wrapper = styled.div<{ isGrabbing: boolean, isDragging: boolean, wasBeingGrabbed: boolean; dimensions: { width: string, height: string } }>`
  position: ${ props => (props.isGrabbing && props.isDragging) ? 'fixed' : 'static' };
  z-index: ${ props => props.wasBeingGrabbed ? 1 : 0 };
  display: flex;
  align-items: center;
  width: ${ props => props.isGrabbing ? props.dimensions.width : '92%' };
  height: ${ props => props.isGrabbing ? props.dimensions.height : '2rem' };
  margin-right: 1%;
  margin-bottom: 0.75rem;
  padding: 0.5rem 4%;
  background-color: ${ COLORS.WHITE };
  border-radius: 15px;
  box-shadow: ${ props => props.isGrabbing ? '0px 1px 10px -5px ' + Color(COLORS.WHITE).darken(0.25).hex() : '' };
  pointer-events: ${ props => (props.isGrabbing || props.isDragging) ? 'none' : 'auto' };
  cursor: ${ props => props.isGrabbing ? 'grabbing' : '' };
  transition: box-shadow 0.25s ease, ${ props => (props.wasBeingGrabbed && !props.isGrabbing) ? 'transform 0.25s ease' : 'transform 0s' };
`

export const Edge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7%;
  height: 100%;
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

export const GrabHandle = styled(Edge)<{ isGrabbing: boolean }>`
  width: 6%;
  margin-left: 1%;
  cursor: ${ props => props.isGrabbing ? 'grabbing' : 'grab' };
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
`

export const Title = styled.div<{ isStrikethrough: boolean }>`
  position: relative;
  color: ${ props => props.isStrikethrough ? Color(COLORS.WHITE).darken(0.75).alpha(0.6).toString() : 'inherit' };
  user-select: none;
  cursor: default;
  transition: all 0.25s ease;
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


// Functions:
const TaskItem = (
  {
    index,
    task,
    mouseX,
    mouseY,
    updateTaskDoneStatus,
    scrollbarYOffset,
    isDragging,
    setIsDragging,
    taskItemBeingDragged,
    setTaskItemBeingDragged,
    grabOffset,
    setGrabOffset,
    canTaskItemMove
  }: {
    index: number
    task: TTask
    mouseX: number
    mouseY: number
    updateTaskDoneStatus: (_id: string, newIsDone: boolean) => void
    scrollbarYOffset: number
    isDragging: boolean
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
    taskItemBeingDragged: {
      _id: string
      index: number
      grabEnd: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
      dimensions?: {
        width: string
        height: string
        dirtyWidth: string
        dirtyHeight: string
      }
    }
    setTaskItemBeingDragged: React.Dispatch<React.SetStateAction<{
      _id: string
      index: number
      grabEnd: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) | undefined
      dimensions?: {
        width: string
        height: string
        dirtyWidth: string
        dirtyHeight: string
      }
    }>>
    grabOffset: {
      x: number
      y: number
    }
    setGrabOffset: React.Dispatch<React.SetStateAction<{
      x: number;
      y: number;
    }>>
    canTaskItemMove: {
      x: boolean
      y: boolean
    }
  }) => {
  // Ref:
  const wrapperRef = useRef<any>(null)
  const grabHandleRef = useRef<any>(null)
  const nodeRef = useRef<SVGSVGElement | null>(null)

  // State:
  const [ isTaskDone, setIsTaskDone ] = useState(task.isDone)
  const [ scribble, setScribble ] = useState<undefined | any>()
  const [ scribbleDimensions, setScribbleDimensions ] = useState({ width: getWidthOfText(task.title, 'Roboto', `${ 16 + (0.5 * 2) }px`), height: 10 })
  const [ scribblePathLength, setScribblePathLength ] = useState(0)
  const [ isScribbleDrawn, setIsScribbleDrawn ] = useState<{ current: boolean, previous: boolean | undefined }>({ current: false, previous: undefined })
  const [ isGrabbing, setIsGrabbing ] = useState(false)
  const [ taskItemDimensions, setTaskItemDimensions ] = useState({ width: '0px', height: '0px', dirtyWidth: '0px', dirtyHeight: '0px' })
  const [ absoluteTaskItemBounds, setAbsoluteTaskItemBounds ] = useState({ x: 0, y: 0 })
  const [ relativeTaskItemBounds, setRelativeTaskItemBounds ] = useState({ x: 0, y: 0 })
  const [ taskItemTranslate, settaskItemTranslate ] = useState({ x: 0, y: 0 })

  // Memo:
  const taskItemBounds = useMemo(() => {}, [])

  // Functions:
  const generateScribble = useCallback(() => {
    let pathLength: number
    const points: [ number, number ][] = [ ...Array(scribbleDimensions.width / 5) ].map((_e, i) => [ i * 5, Math.floor(Math.random() * scribbleDimensions.height) ])
    const curve = d3Select(nodeRef.current)
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
  }, [ scribbleDimensions.height, scribbleDimensions.width ])

  const grabStart = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    const tasksWrapperBounds = document.getElementById('tasks-wrapper')?.getBoundingClientRect() as DOMRect
    const taskItemBounds = wrapperRef.current.getBoundingClientRect() as DOMRect
    const taskItemComputedStyle = window.getComputedStyle(wrapperRef.current)
    const newRelativeTaskItemBounds = { x: taskItemBounds.x - tasksWrapperBounds.x, y: taskItemBounds.y - tasksWrapperBounds.y }
    const relativeClient = { x: event.clientX - tasksWrapperBounds.x, y: event.clientY - tasksWrapperBounds.y }
    setTaskItemDimensions({
      width: taskItemComputedStyle.width,
      height: taskItemComputedStyle.height,
      dirtyWidth: `${
        taskItemBounds.width +
        parseFloat(taskItemComputedStyle.marginRight) +
        parseFloat(taskItemComputedStyle.marginLeft)
      }px`,
      dirtyHeight: `${
        taskItemBounds.height +
        parseFloat(taskItemComputedStyle.marginTop) +
        parseFloat(taskItemComputedStyle.marginBottom)
      }px`
    })
    setAbsoluteTaskItemBounds(taskItemBounds)
    setRelativeTaskItemBounds(newRelativeTaskItemBounds)
    setGrabOffset({ x: relativeClient.x, y: relativeClient.y })
    setIsGrabbing(true)
    setIsDragging(true)
  }, [ setGrabOffset, setIsDragging ])

  const grabEnd = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsGrabbing(false)
    setIsDragging(false)
  }, [ setIsDragging ])

  // Effects:
  useEffect(() => {
    generateScribble()
  }, [ generateScribble ])

  useEffect(() => {
    setScribbleDimensions({ width: getWidthOfText(task.title, 'Roboto', `${ 16 + (0.5 * 2) }px`), height: 10 })
  }, [ task.title ])

  useEffect(() => {
    if (isScribbleDrawn.current === true && isScribbleDrawn.previous === false && isTaskDone === false && scribble !== undefined) {
      (async () => {
        playStrikeThrough()
        await scribble
          .attr('stroke-dashoffset', 0)
          .transition()
          .duration(500)
          .attr('stroke-dashoffset', scribblePathLength)
          .end()
        scribble.remove()
        setIsScribbleDrawn({ current: false, previous: isScribbleDrawn.current })
        generateScribble()
      })()
    } else if (isScribbleDrawn.current === false && isTaskDone === true && scribble !== undefined) {
      (async () => {
        playStrikeThrough()
        await scribble
          .attr('stroke-dashoffset', scribblePathLength)
          .transition()
          .duration(500)
          .attr('stroke-dashoffset', 0)
          .end()
        setIsScribbleDrawn({ current: true, previous: false })
      })()
    }
  }, [ generateScribble, isScribbleDrawn, isTaskDone, scribble, scribblePathLength ])

  useEffect(() => {
    if (isGrabbing) {
      setTaskItemBeingDragged({
        _id: task._id,
        index,
        grabEnd,
        dimensions: taskItemDimensions
      })
    }
  }, [ grabEnd, index, isGrabbing, setTaskItemBeingDragged, task._id, taskItemDimensions ])
  
  // Return:
  return (
    <Wrapper
      ref={ wrapperRef }
      isGrabbing={ isGrabbing }
      isDragging={ isDragging }
      wasBeingGrabbed={ taskItemBeingDragged._id === task._id }
      dimensions={{
        width: taskItemDimensions.width,
        height: taskItemDimensions.height
      }}
      style={{
        left: isGrabbing ? '' : '',
        top: isGrabbing ? relativeTaskItemBounds.y - scrollbarYOffset : '',
        transform: isGrabbing ?
          `translate(${
            0
          }px, ${
            (mouseY - absoluteTaskItemBounds.y) + relativeTaskItemBounds.y - grabOffset.y
          }px)`
        :
          isDragging && (taskItemBeingDragged?.index < index)
          ?
          `translate(0px, ${ taskItemBeingDragged.dimensions?.dirtyHeight })`
          :
          'translate(0px, 0px)'
      }}
    >
      <GrabHandle
        ref={ grabHandleRef }
        onMouseDown={ grabStart }
        isGrabbing={ isGrabbing }
      >
        <HalfGrabIcon style={{ marginLeft: '-1.3rem' }} />
        <HalfGrabIcon />
      </GrabHandle>
      <Edge>
        <Checkbox
          isChecked={ isTaskDone }
          onClick={() => {
            setIsTaskDone(!isTaskDone)
            updateTaskDoneStatus(task._id, !isTaskDone)
          }}
        >
          <CheckmarkIcon isvisible={ `${ isTaskDone }` } />
        </Checkbox>
      </Edge>
      <Middle>
        <LineSVG
          ref={ nodeRef }
          width={ scribbleDimensions.width + 5 }
          height={ scribbleDimensions.height * 2 }
          viewBox={ `0 0 ${ scribbleDimensions.width - 5 } ${ scribbleDimensions.height }` }
          preserveAspectRatio='xMidYMid meet'
        />
        <Title isStrikethrough={ isTaskDone }>{ task.title }</Title>
      </Middle>
      <Edge>
        <EditIcon isvisible={ `${ !isTaskDone }` } />
        <DeleteIcon isvisible={ `${ isTaskDone }` } />
      </Edge>
    </Wrapper>
  )
}


// Exports:
export default TaskItem
