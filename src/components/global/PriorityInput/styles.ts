// Packages:
import styled from 'styled-components'
import Color from 'color'


// Constants:
import { SECONDARY_COLORS, THEME_COLOR } from '../../../styles/colors'



// Exports:
export const Wrapper = styled.div`
  width: 40%;
  height: 0.875rem;
  padding: 0.5rem;
  font-weight: 300;
  font-size: 0.875rem;
  color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  line-height: 1rem;
  background-color: transparent;
  border: 1px solid ${ SECONDARY_COLORS.BORDER_COLOR.DARK(220).lighten(0.3).toString() };
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background-color: ${ Color(THEME_COLOR.OCEAN).alpha(0.2).toString() };
  }
`
