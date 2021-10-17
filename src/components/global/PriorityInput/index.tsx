// Packages:
import React from 'react'


// Typescript:
import { PRIORITY_VALUES } from './types'


// Imports:
import { CgArrowsExchangeV } from 'react-icons/cg'


// Constants:
import { SECONDARY_COLORS } from '../../../styles/colors'


// Styles:
import {
  Wrapper,
  Current,
  Details,
  PriorityDot
} from './styles'


const PRIORITY_TYPE = {
  [ PRIORITY_VALUES.LOW ]: {
    color: '',
    name: 'low'
  },
  [ PRIORITY_VALUES.NORMAL ]: {
    color: 'white',
    name: 'normal'
  },
  [ PRIORITY_VALUES.MEDIUM ]: {
    color: '',
    name: 'medium'
  },
  [ PRIORITY_VALUES.HIGH ]: {
    color: '',
    name: 'high'
  }
}

// Functions:
const PriorityInput = ({ currentPriority }: { currentPriority: PRIORITY_VALUES }) => {
  return (
    <Wrapper>
      <Current>
        <Details><PriorityDot style={{ backgroundColor: PRIORITY_TYPE[ currentPriority ].color }} />{ PRIORITY_TYPE[ currentPriority ].name }</Details>
        <CgArrowsExchangeV style={{ width: '1rem', height: '1rem', color: SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.toString() }} />
      </Current>
      {/* <OptionsOverlay></OptionsOverlay> */}
    </Wrapper>
  )
}


// Exports:
export default PriorityInput
