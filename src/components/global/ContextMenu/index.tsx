// Packages:
import React, { useRef, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { useDispatch, useSelector } from 'react-redux'
import { useDebounce } from 'react-use'
import dateFormat from 'dateformat'


// Typescript:
import { IState } from '../../../redux/reducers/types'


// Imports:
import { MdContentCopy } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoAddCircleOutline } from 'react-icons/io5'


// Constants:
import COLORS from '../../../styles/colors'


// Redux:
import { updateLocalStorageDb } from '../../../redux/actions'


// Styles:
export const Wrapper = styled.div<{ isShowing: boolean, invert: { X: boolean, Y: boolean } }>`
  position: absolute;
  width: 15rem;
  /* height: 20rem; */
  margin-top: ${ props => props.isShowing ? 0 : props.invert.Y ? -1 : 1 }rem;
  background-color: #FFFFFF;
  box-shadow: 0px 2px 5px -5px ${ Color(COLORS.BLACK).alpha(0.5).toString() };
  font-size: 0.9rem;
  border: 1px solid ${ Color(COLORS.WHITE).darken(0.1).toString() };
  border-radius: 5px;
  transform: ${ props => 'translate(' + (props.invert.X ? '-15.25rem, ' : '0.25rem, ') + (props.invert.Y ? '-20.25rem' : '0.25rem') + ')'  };
  transition: filter 0.2s ease, margin-top 0.2s ease;
`

export const Option = styled.div<{ clickable: boolean }>`
  display: flex;
  align-items: center;
  width: 13rem;
  height: 1rem;
  padding: 1rem 1rem;
  color: ${ props => props.clickable ? COLORS.BLACK : Color(COLORS.WHITE).darken(0.5).toString() };
  background-color: transparent;
  user-select: none;
  cursor: ${ props => props.clickable ? 'pointer' : 'default' };
  transition: all 0.25s ease;

  &:hover {
    background-color: ${ props => props.clickable ? Color(COLORS.WHITE).darken(0.03).toString() : 'transparent' };
    transition: all 0.25s ease;
  }
`

export const LastEdit = styled.div`
  width: 13rem;
  min-height: 1rem;
  padding: 1rem 1rem;
  font-size: 0.8rem;
  color: ${ Color(COLORS.WHITE).darken(0.5).toString() };
  user-select: none;
`


// Functions:
const ContextMenu = () => {
  // Constants:
  const dispatch = useDispatch()

  // Ref:
  const wrapperRef = useRef<any>(null)

  // State:
  const contextTarget = useSelector((state: IState) => state.global.contextTarget)
  const localStorageDb = useSelector((state: IState) => state.global.localStorageDb)
  const footerBounds = useSelector((state: IState) => state.footer.bounds)
  const [ wrapperBounds, setWrapperBounds ] = useState<DOMRect | null>(null)
  const [ anchorPoint, setAnchorPoint ] = useState({ X: 0, Y: 0 })
  const [ isAlreadyActive, setIsAlreadyActive ] = useState(false)
  const [ isShowing, setIsShowing ] = useState(false)
  const [ zIndex, setZIndex ] = useState(-1)
  const [ focusedExtensionID, setFocusedExtensionID ] = useState<string | null>(null)
  const [ isFocusedOnExtension, setIsFocusedOnExtension ] = useState(false)

  // Functions:
  const closeMenu = useCallback(async () => {
    setIsAlreadyActive(false)
    setIsShowing(false)
    if (zIndex === 6000) {
      await new Promise(resolve => setTimeout(resolve, 250))
      setIsShowing(false)
      setZIndex(-1)
    }
    setWrapperBounds(null)
  }, [ zIndex ])

  const handleClick = useCallback(async (event: MouseEvent) => {
    if (wrapperRef.current.contains(event.target)) return
    closeMenu()
  }, [ closeMenu ])

  const handleContextMenu = useCallback(async (event: MouseEvent) => {
    event.preventDefault()
    if (isShowing) {
      setIsAlreadyActive(true)
      setIsShowing(false)
      await new Promise(resolve => setTimeout(resolve, 200))
      setIsShowing(true)
    } if (zIndex === -1) setZIndex(6000) 
    setAnchorPoint({ X: event.pageX, Y: event.pageY })
    setWrapperBounds(wrapperRef.current.getBoundingClientRect() as DOMRect)
    if (!isShowing) setIsShowing(true)
  }, [ isShowing, zIndex ])

  const deleteExtension = useCallback(() => {
    const [ currentExtensions, currentLayout ] = [ localStorageDb.extensions, localStorageDb.layout ]
    currentExtensions.splice(currentExtensions.findIndex(extension => extension._id === focusedExtensionID), 1)
    currentLayout.splice(currentLayout.findIndex(layout => layout.i === focusedExtensionID), 1)
    dispatch(updateLocalStorageDb({ extensions: currentExtensions, layout: currentLayout }))
    closeMenu()
  }, [ closeMenu, dispatch, focusedExtensionID, localStorageDb.extensions, localStorageDb.layout ])

  // Effects:
  useEffect(() => {
    document.addEventListener('click', handleClick)
    document.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('blur', () => handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('blur', () => handleClick)
    }
  }, [ handleClick, handleContextMenu ])

  useEffect(() => {
    let extensionID: string | null = null
    for (let key in contextTarget) { if (contextTarget[ key ]) { extensionID = key; break } }
    setFocusedExtensionID(extensionID)
  }, [ contextTarget ])

  useDebounce(() => {
    if (!!focusedExtensionID) setIsFocusedOnExtension(true)
    else setIsFocusedOnExtension(false)
  }, isAlreadyActive ? 200 : 0, [ focusedExtensionID ])

  // Return:
  return (
    <Wrapper
      ref={ wrapperRef }
      isShowing={ isShowing }
      style={{
        top: anchorPoint.Y,
        left: anchorPoint.X,
        zIndex: zIndex,
        filter: isShowing ? 'opacity(1)' : 'opacity(0)'
      }}
      invert={{
        X: anchorPoint.X + (wrapperBounds?.width ?? -1) > (footerBounds?.right ?? 0),
        Y: anchorPoint.Y + (wrapperBounds?.height ?? -1) > (footerBounds?.top ?? 0)
      }}
    >
      {
        isFocusedOnExtension ?
        <>
          <Option style={{ borderRadius: '5px 5px 0 0' }} clickable={ false }>
            <MdContentCopy style={{ marginRight: '0.5rem', marginBottom: '-0.1rem', fontSize: '1rem' }} />
            Clone
          </Option>
          <Option clickable={ true } onClick={ deleteExtension }>
            <AiOutlineDelete style={{ marginRight: '0.5rem', marginBottom: '-0.1rem', fontSize: '1rem' }} />
            Delete
          </Option>
        </>
        :
        <>
          <Option style={{ borderRadius: '5px 5px 0 0' }} clickable={ false }>
            <IoAddCircleOutline style={{ marginRight: '0.5rem', marginBottom: '-0.1rem', fontSize: '1rem' }} />
            Add an extension
          </Option>
          <Option clickable={ false }>
            Show stats
          </Option>
        </>
      }
      <LastEdit>
        <div style={{ marginBottom: '0.2rem' }}>Last edited by You</div>
        <span>{ dateFormat(Date.now(), 'dd/mm/yyyy') }</span>
      </LastEdit>
    </Wrapper>
  )
}


// Exports:
export default ContextMenu
