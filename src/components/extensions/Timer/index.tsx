// Packages:
import React, { useRef, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Color from 'color'


// Constants:
import COLORS from '../../../styles/colors'
import { SMOOTH_INNER_SHADOW, SMOOTH_SHADOW } from '../../../styles'


// Styles:
export const Wrapper = styled.div`
  position: relative;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  width: 16rem;
  height: 8rem;
  padding: 1rem;
  /* padding-right: 0; */
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

const Slider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6.5rem;
  height: 6.5rem;
  margin: 1rem;
  border-radius: 50%;
  background-color: ${ Color(COLORS.WHITE).darken(0.025).hex() };
  box-shadow:
    inset 5px 5px 7px -9px ${ COLORS.WHITE },
    inset -3px -3px 3px -4px ${ Color(COLORS.WHITE).darken(0.6).hex() },
    9px 6px 18px -10px ${ Color(COLORS.BLACK).alpha(0.4).toString() },
    0px 0px 10px -3px ${ Color(COLORS.BLACK).lighten(5).alpha(0.5).toString() },
    -2px -2px 3px -2px #FFFFFF;
  user-select: none;
`

const Handle = styled.div`
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
`

const Knob = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  margin: auto;
  border-radius: 50%;
  background-color: ${ Color(COLORS.WHITE).darken(0.025).hex() };
`


// Functions:
const Timer = ({ _id }: { _id: string }) => {
  // Ref:
  const handleRef = useRef<any>(null)

  // State:
  const [ knobRotation, setKnobRotation ] = useState(220)
  const [ isDraggingKnob, setisDraggingKnob ] = useState(false)
  const [ handleBounds, setHandleBounds ] = useState<DOMRect | null>(null)

  // Functions:
  const calculateDegree = useCallback((e: MouseEvent) => {
    if (handleBounds === null) return 0
    return (Math.atan2((handleBounds.y + handleBounds.height / 2) - e.clientY, (handleBounds.x + handleBounds.width / 2) - e.clientX) * (180 / Math.PI) + 180)
  }, [ handleBounds ])

  const rotateKnob = useCallback((e: MouseEvent) => {
    const degree = Math.floor(calculateDegree(e) + 90) % 360
    if (degree <= 140 || degree >= 220) setKnobRotation(degree)
  }, [ calculateDegree ])

  // Effects:
  useEffect(() => {
    if (isDraggingKnob) {
      if (handleBounds === null) setHandleBounds(handleRef.current.getBoundingClientRect() as DOMRect)
      document.addEventListener('mouseup', () => setisDraggingKnob(false))
      document.addEventListener('mousemove', rotateKnob)
    } else {
      setHandleBounds(null)
      document.removeEventListener('mousemove', rotateKnob)
    }
    return () => {
      document.removeEventListener('mousemove', rotateKnob)
    }
  }, [ isDraggingKnob, calculateDegree, rotateKnob, handleBounds ])

  useEffect(() => {
    let timerDuration = 0
    if (knobRotation >= 220) {
      timerDuration = (knobRotation - 220) / (140 / 60) 
    } else {
      timerDuration = (140 + knobRotation) / (140 / 60) 
    }
    console.log(Math.round(timerDuration))
  }, [ knobRotation ])

  // Return:
  return (
    <Wrapper>
      <Slider ref={ handleRef } className='draggableCancel'>
        <Handle style={{ transform: `rotate(${ knobRotation }deg)` }}>
          <Knob
            onMouseDown={ () => setisDraggingKnob(true) }
            style={{
              boxShadow:`
              inset ${ Math.cos((knobRotation * Math.PI) / 180).toFixed(2) }px ${ Math.cos((knobRotation * Math.PI) / 180).toFixed(2) }px 15px -10px #000000,
              ${ Math.cos((knobRotation * Math.PI) / 180).toFixed(2) }px ${ Math.cos((knobRotation * Math.PI) / 180).toFixed(2) }px 5px 0px #FFFFFF,
              inset ${ -1 * +Math.cos((knobRotation * Math.PI) / 180).toFixed(2) }px ${ -1 * +Math.cos((knobRotation * Math.PI) / 180).toFixed(2) }px 5px 0px #FFFFFF,
              inset ${ Math.cos((knobRotation * Math.PI) / 180).toFixed(2) }px ${ Math.cos((knobRotation * Math.PI) / 180).toFixed(2) }px 5px -10px #000000`
            }}
          />
        </Handle>
      </Slider>
    </Wrapper>
  )
}


// Exports:
export default Timer
