// Packages:
import React, { useRef, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'


// Typescript:
import { IState } from '../../../redux/reducers/types'


// Constants:
import COLORS from '../../../styles/colors'
import { SMOOTH_INNER_SHADOW, SMOOTH_SHADOW } from '../../../styles'


// Styles:
const Wrapper = styled.div<{ isShowing: boolean, invert: { X: boolean, Y: boolean } }>`
  position: absolute;
  width: 12rem;
  height: 15rem;
  background-color: ${ COLORS.WHITE };
  box-shadow: ${ SMOOTH_INNER_SHADOW }, ${ SMOOTH_SHADOW };
  filter: ${ props=> props.isShowing ? 'opacity(1)' : 'opacity(0)'};
  border-radius: 10px;
  transform: ${ props => 'translate(' + (props.invert.X ? '-12.25rem, ' : '0.25rem, ') + (props.invert.Y ? '-15.25rem' : '0.25rem') + ')'  };
  transition: filter 0.25s ease;
`


// Functions:
const ContextMenu = () => {
  // Ref:
  const wrapperRef = useRef<any>(null)

  // State:
  const contextTarget = useSelector((state: IState) => state.global.contextTarget)
  const footerBounds = useSelector((state: IState) => state.footer.bounds)
  const [ wrapperBounds, setWrapperBounds ] = useState<DOMRect | null>(null)
  const [ anchorPoint, setAnchorPoint ] = useState({ X: 0, Y: 0 })
  const [ isShowing, setIsShowing ] = useState(false)
  const [ zIndex, setZIndex ] = useState(-1)

  // Functions:
  const handleClick = useCallback(async () => {
    if (isShowing) setIsShowing(false)
    if (zIndex === 6000) {
      await new Promise(resolve => setTimeout(resolve, 250))
      setZIndex(-1)
    }
    setWrapperBounds(null)
  }, [ isShowing, zIndex ])

  const handleContextMenu = useCallback(async (event: MouseEvent) => {
    event.preventDefault()
    if (isShowing) {
      setIsShowing(false)
      await new Promise(resolve => setTimeout(resolve, 250))
      setIsShowing(true)
    } if (zIndex === -1) setZIndex(6000) 
    setAnchorPoint({ X: event.pageX, Y: event.pageY })
    setWrapperBounds(wrapperRef.current.getBoundingClientRect() as DOMRect)
    if (!isShowing) setIsShowing(true)
  }, [ isShowing, zIndex ])

  // Effects:
  useEffect(() => {
    document.addEventListener('click', handleClick)
    document.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('blur', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('blur', handleClick)
    }
  }, [ handleClick, handleContextMenu ])

  // Return:
  return (
    <Wrapper
      ref={ wrapperRef }
      isShowing={ isShowing }
      style={{
        top: anchorPoint.Y,
        left: anchorPoint.X,
        zIndex: zIndex
      }}
      invert={{
        X: anchorPoint.X + (wrapperBounds?.width ?? -1) > (footerBounds?.right ?? 0),
        Y: anchorPoint.Y + (wrapperBounds?.height ?? -1) > (footerBounds?.top ?? 0)
      }}
    >
      
    </Wrapper>
  )
}


// Exports:
export default ContextMenu
