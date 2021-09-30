// Packages:
import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import useResizeObserver from '@react-hook/resize-observer'


// Redux:
import { updateFooter } from '../../../redux/actions'


// Styles:
import { Wrapper } from './styles'


// Functions:
const Footer = () => {
  // Constants:
  const dispatch = useDispatch()

  // Ref:
  const wrapperRef = useRef<any>(null)

  // Effects:
  useEffect(() => {
    dispatch(updateFooter({ bounds: wrapperRef.current.getBoundingClientRect() }))
  }, [ dispatch, wrapperRef ])
  useResizeObserver(wrapperRef, () => dispatch(updateFooter({ bounds: wrapperRef.current.getBoundingClientRect() }))) // NOTE: Not using entry.contentRect

  // Return:
  return (
    <Wrapper ref={ wrapperRef }>
      
    </Wrapper>
  )
}


// Exports:
export default Footer
