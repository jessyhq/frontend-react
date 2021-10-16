// Packages:
import React from 'react'


// Typescript:
import { PRIORITY_VALUES } from './types'


// Styles:
import {
  Wrapper
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
      
    </Wrapper>
  )
}


// Exports:
export default PriorityInput
