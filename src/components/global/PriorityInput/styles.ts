// Packages:
import styled from 'styled-components'
import Color from 'color'


// Constants:
import { SECONDARY_COLORS, THEME_COLOR } from '../../../styles/colors'



// Exports:
export const Wrapper = styled.div`
  position: relative;
  width: 40%;
  font-weight: 300;
  font-size: 0.875rem;
  color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  line-height: 1rem;
  border: 1px solid ${ SECONDARY_COLORS.BORDER_COLOR.DARK(220).lighten(0.3).toString() };
  border-radius: 5px;
`

export const Current = styled.div`
  position: relative;
  top: -1px;
  z-index: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: transparent;
  border-radius: 5px;
  transition: all 0.25s ease;
  cursor: pointer;

  &:hover {
    background-color: ${ Color(THEME_COLOR.OCEAN).alpha(0.2).toString() };
  }
`

export const Details = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const PriorityDot = styled.div`
  width: 0.875rem;
  height: 0.875rem;
  margin-right: 0.5rem;
  border-radius: 50%;
`

export const OptionsOverlay = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: -1px;
  left: -1px;
  width: 100%;
  min-height: 0.85rem;
  color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  background-color: ${ SECONDARY_COLORS.WRAPPER.SOLID.DARK.hex() };
  border: 1px solid ${ SECONDARY_COLORS.BORDER_COLOR.DARK(220).lighten(0.3).toString() };
  border-radius: 5px;
  filter: opacity(${ props => props.isVisible ? 1 : 0 });
  transition: all 0.25s ease;
`

export const Option = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 0.5rem);
  padding: 0.5rem;
  padding-right: 0;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background-color: ${ Color(THEME_COLOR.OCEAN).alpha(0.2).toString() };
  }
`
