// Packages:
import React, { useRef, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Color from 'color'
import { useDispatch, useSelector } from 'react-redux'
import { useDebounce } from 'react-use'
import dateFormat from 'dateformat'


// Typescript:
import { IState } from '../../../redux/reducers/types'
import { EXTENDED_MENU } from './types'


// Imports:
import { MdContentCopy, MdFactCheck } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'
import { IoAddCircleOutline, IoMusicalNotes } from 'react-icons/io5'
import { RiArrowRightSFill } from 'react-icons/ri'


// Constants:
import COLORS from '../../../styles/colors'
import { EXTENSION_TYPE, OBJECT_STORE } from '../../../constants/indexedDB/objectStores'


// Redux:
import { updateObjectStore } from '../../../redux/actions'


// Styles:
const MenuTemplate = styled.div`
  position: absolute;
  width: 15rem;
  background-color: #FFFFFF;
  box-shadow: 0px 2px 5px -5px ${ Color(COLORS.BLACK).alpha(0.5).toString() };
  font-size: 0.9rem;
  border: 1px solid ${ Color(COLORS.WHITE).darken(0.1).toString() };
  border-radius: 5px;
  transition: filter 0.2s ease, margin-top 0.2s ease;
`

export const Wrapper = styled(MenuTemplate)<{ currentHeight: number, isShowing: boolean, invert: { X: boolean, Y: boolean } }>`
  margin-top: ${ props => props.isShowing ? 0 : props.invert.Y ? -1 : 1 }rem;
  transform: ${ props => 'translate(' + (props.invert.X ? '-15.25rem, ' : '0.25rem, ') + (props.invert.Y ? `-${ props.currentHeight }.25rem` : '0.25rem') + ')'  };
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

export const ExtendedMenu = styled(MenuTemplate)<{ isShowing: boolean }>`
  margin-top: ${ props => props.isShowing ? 0 : 1 }rem;
  margin-left: 14rem;
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
  const __DEV__ = false

  // Ref:
  const wrapperRef = useRef<any>(null)

  // State:
  const contextTarget = useSelector((state: IState) => state.global.contextTarget)
  const coreObjectStore = useSelector((state: IState) => state.global.localStorageDb.objectStores.core)
  const extensionsObjectStore = useSelector((state: IState) => state.global.localStorageDb.objectStores.extensions)
  const footerBounds = useSelector((state: IState) => state.footer.bounds)
  const [ wrapperBounds, setWrapperBounds ] = useState<DOMRect | null>(null)
  const [ anchorPoint, setAnchorPoint ] = useState({ X: 0, Y: 0 })
  const [ isAlreadyActive, setIsAlreadyActive ] = useState(false)
  const [ isShowing, setIsShowing ] = useState(false)
  const [ zIndex, setZIndex ] = useState(-1)
  const [ focusedExtension, setFocusedExtension ] = useState<{ _id?: string, type?: EXTENSION_TYPE }>({})
  const [ extensionLastEdited, setExtensionLastEdited ] = useState(0)
  const [ isFocusedOnExtension, setIsFocusedOnExtension ] = useState(false)
  const [ activeExtendedMenu, setActiveExtendedMenu ] = useState<EXTENDED_MENU | undefined>(undefined)

  // Functions:
  const closeMenu = useCallback(async () => {
    if (__DEV__) return
    setIsAlreadyActive(false)
    setIsShowing(false)
    if (zIndex === 6000) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setIsShowing(false)
      setZIndex(-1)
    }
    setWrapperBounds(null)
  }, [ __DEV__, zIndex ])

  const handleClick = useCallback(async (event: MouseEvent | FocusEvent) => {
    if (__DEV__) return
    if (event.target === window) closeMenu()
    else if (wrapperRef.current.contains(event.target)) return
    closeMenu()
  }, [ __DEV__, closeMenu ])

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
    const [ currentExtensions, currentLayout ] = [ coreObjectStore.extensions, coreObjectStore.layout ]
    currentExtensions.splice(currentExtensions.findIndex(extension => extension._id === focusedExtension._id), 1)
    currentLayout.splice(currentLayout.findIndex(layout => layout.i === focusedExtension._id), 1)
    dispatch(updateObjectStore({ extensions: currentExtensions, layout: currentLayout }, OBJECT_STORE.CORE))
    closeMenu()
  }, [ closeMenu, dispatch, focusedExtension, coreObjectStore ])

  // Effects:
  useEffect(() => {
    document.addEventListener('click', handleClick)
    document.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('blur', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('blur', () => handleClick)
    }
  }, [ handleClick, handleContextMenu ])

  useEffect(() => {
    const extension: { _id?: string, type?: EXTENSION_TYPE } = {}
    for (let key in contextTarget) { if (contextTarget[ key ] !== undefined) { extension._id = key; extension.type = contextTarget[ key ]; break } }
    setFocusedExtension(extension);
    (async () => {
      if (extension.type && extension._id && isFocusedOnExtension) {
        if (isAlreadyActive) await new Promise(resolve => setTimeout(resolve, 200))
        setExtensionLastEdited(extensionsObjectStore[ extension.type ][ extension._id ].time.lastEdited)
      }
    })()
  }, [ contextTarget, extensionsObjectStore, isAlreadyActive, isFocusedOnExtension ])

  useDebounce(() => {
    if (!!focusedExtension._id) setIsFocusedOnExtension(true)
    else setIsFocusedOnExtension(false)
  }, isAlreadyActive ? 200 : 0, [ focusedExtension._id ])

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
      currentHeight={ Math.round((wrapperBounds?.height ?? 160) / 16) }
    >
      {
        isFocusedOnExtension ?
        <>
          <Option style={{ borderRadius: '5px 5px 0 0' }} clickable={ false }>
            <MdContentCopy style={{ marginRight: '0.5rem', marginBottom: '-0.1rem', fontSize: '1rem' }} />
            clone
          </Option>
          <Option clickable={ true } onClick={ deleteExtension }>
            <AiOutlineDelete style={{ marginRight: '0.5rem', marginBottom: '-0.1rem', fontSize: '1rem' }} />
            delete
          </Option>
          <LastEdit>
            <div style={{ marginBottom: '0.2rem' }}>last edited by you</div>
            <span>{ dateFormat(extensionLastEdited, 'dd/mm/yyyy') }</span>
          </LastEdit>
        </>
        :
        <>
          <Option
            style={{ borderRadius: '5px 5px 0 0' }}
            clickable={ true }
            onMouseOver={ () => setActiveExtendedMenu(EXTENDED_MENU.ADD_AN_EXTENSION) }
            onMouseOut={ () => setActiveExtendedMenu(undefined) }
          >
            <span style={{ width: '100%' }}>
              <IoAddCircleOutline style={{ marginRight: '0.5rem', marginBottom: '-0.3rem', fontSize: '1rem' }} />
              add an extension
            </span>
            <RiArrowRightSFill style={{ marginRight: '-0.5rem', marginBottom: '-0.2rem', fontSize: '1.5rem', color: Color(COLORS.WHITE).darken(0.5).hex() }} />
            <ExtendedMenu
              isShowing={ activeExtendedMenu === EXTENDED_MENU.ADD_AN_EXTENSION }
              style={{
                filter: activeExtendedMenu === EXTENDED_MENU.ADD_AN_EXTENSION ? 'opacity(1)' : 'opacity(0)'
              }}
            >
              <Option style={{ borderRadius: '5px 5px 0 0' }} clickable={ true }>
                <svg width="0" height="0">
                  <linearGradient id="todolist-icon-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop stopColor="rgba(194,6,29,1)" offset="25%" />
                    <stop stopColor="rgba(210,52,193,1)" offset="75%" />
                  </linearGradient>
                </svg>
                <MdFactCheck style={{ marginRight: '0.5rem', marginBottom: '-0.1rem', fontSize: '1rem', fill: 'url(#todolist-icon-gradient)' }} />
                todolist
              </Option>
              <Option style={{ borderRadius: '0 0 5px 5px' }} clickable={ true }>
                <svg width="0" height="0">
                  <linearGradient id="music-icon-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop stopColor="rgba(179,6,194,1)" offset="25%" />
                    <stop stopColor="rgba(52,151,210,1)" offset="75%" />
                  </linearGradient>
                </svg>
                <IoMusicalNotes style={{ marginRight: '0.5rem', marginBottom: '-0.1rem', fontSize: '1rem', fill: 'url(#music-icon-gradient)' }} />
                music
              </Option>
            </ExtendedMenu>
          </Option>
          <Option clickable={ false }>
            show stats
          </Option>
        </>
      }
    </Wrapper>
  )
}


// Exports:
export default ContextMenu
