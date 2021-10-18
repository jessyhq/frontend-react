// Packages:
import { useRef, useState, useCallback, useEffect } from 'react'
import { useDebounce } from 'react-use'


// Typescript:
import { PRIORITY_VALUES } from './types'


// Imports:
import { CgArrowsExchangeV } from 'react-icons/cg'


// Constants:
import { PRIORITY_TYPE } from '../../../constants'
import { SECONDARY_COLORS } from '../../../styles/colors'


// Styles:
import {
  Wrapper,
  Current,
  Details,
  PriorityDot,
  OptionsOverlay,
  Option
} from './styles'


// Functions:
const PriorityInput = ({ priority }: { priority: PRIORITY_VALUES }) => {
  // Ref:
  const wrapperRef = useRef<any>(null)

  // State:
  const [ isOptionsOverlayVisible, setIsOptionsOverlayVisible ] = useState(false)
  const [ optionsOverlayZIndex, setOptionsOverlayZIndex ] = useState(false)
  const [ currentPriority, setCurrentPriority ] = useState(priority)

  // Functions:
  const handleClick = useCallback(async (event: MouseEvent) => {
    if (event.target && wrapperRef.current) if (!wrapperRef.current.contains(event.target) && isOptionsOverlayVisible) setIsOptionsOverlayVisible(false)
  }, [ isOptionsOverlayVisible ])

  const selectOption = useCallback(async (newPriority: PRIORITY_VALUES) => {
    setCurrentPriority(newPriority)
    await new Promise(resolve => setTimeout(resolve, 250))
    setIsOptionsOverlayVisible(false)
  }, [])

  // Effects:
  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [ handleClick ])

  useDebounce(() => setOptionsOverlayZIndex(isOptionsOverlayVisible), isOptionsOverlayVisible ? 0 : 250)

  // Return:
  return (
    <Wrapper ref={ wrapperRef }>
      <Current onClick={ () => setIsOptionsOverlayVisible(!isOptionsOverlayVisible) }>
        <Details><PriorityDot style={{ backgroundColor: PRIORITY_TYPE[ currentPriority ].color }} />{ PRIORITY_TYPE[ currentPriority ].name }</Details>
        <CgArrowsExchangeV style={{ width: '1rem', height: '1rem', color: SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.toString() }} />
      </Current>
      <OptionsOverlay isVisible={ isOptionsOverlayVisible } style={{ zIndex: optionsOverlayZIndex ? 1 : -1, transform: PRIORITY_TYPE[ currentPriority ].transform }}>
        <Option onClick={ () => selectOption(PRIORITY_VALUES.LOW) }>
          <PriorityDot style={{ backgroundColor: PRIORITY_TYPE[ PRIORITY_VALUES.LOW ].color }} />{ PRIORITY_TYPE[ PRIORITY_VALUES.LOW ].name }
        </Option>
        <Option onClick={ () => selectOption(PRIORITY_VALUES.NORMAL) }>
          <PriorityDot style={{ backgroundColor: PRIORITY_TYPE[ PRIORITY_VALUES.NORMAL ].color }} />{ PRIORITY_TYPE[ PRIORITY_VALUES.NORMAL ].name }
        </Option>
        <Option onClick={ () => selectOption(PRIORITY_VALUES.MEDIUM) }>
          <PriorityDot style={{ backgroundColor: PRIORITY_TYPE[ PRIORITY_VALUES.MEDIUM ].color }} />{ PRIORITY_TYPE[ PRIORITY_VALUES.MEDIUM ].name }
        </Option>
        <Option onClick={ () => selectOption(PRIORITY_VALUES.HIGH) }>
          <PriorityDot style={{ backgroundColor: PRIORITY_TYPE[ PRIORITY_VALUES.HIGH ].color }} />{ PRIORITY_TYPE[ PRIORITY_VALUES.HIGH ].name }
        </Option>
      </OptionsOverlay>
    </Wrapper>
  )
}


// Exports:
export default PriorityInput
