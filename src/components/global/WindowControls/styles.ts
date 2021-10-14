// Packages:
import styled from 'styled-components'


// Imports:
import { BsDashLg } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'


// Constants:
import { SECONDARY_COLORS } from '../../../styles/colors'


// Exports:
export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 1rem;
  font-size: 0.75rem;
  color: ${ SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() };
`

export const Minimize = styled(BsDashLg)`
  margin-right: 0.75rem;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  }

  &:active {
    color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.darken(0.2).hex() };
  }
`

export const Close = styled(IoClose)`
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  }

  &:active {
    color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.darken(0.2).hex() };
  }
`