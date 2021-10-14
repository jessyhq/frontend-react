// Packages:
import styled from 'styled-components'
import Color from 'color'


// Constants:
import { COLORS } from '../../../styles/colors'
import { SMOOTH_INNER_SHADOW, SMOOTH_SHADOW } from '../../../styles'


// Exports:
export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 35rem;
  height: 8rem;
  padding: 1rem;
  padding-right: 0;
  background-color: ${ Color(COLORS.WHITE).darken(0.025).hex() };
  border-radius: 10px;
  box-shadow: ${ SMOOTH_INNER_SHADOW };
  cursor: grab;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 10px;
    box-shadow: ${ SMOOTH_SHADOW };
  }
`

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 92.5%;
  height: 100%;
  padding-right: 0.2rem;
  border-radius: 10px;
  background-color: ${ Color(COLORS.BLACK).lighten(1).hex() };
  cursor: default;
`

export const Screen = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 290px;
  overflow: hidden;
  border-radius: 7.5px;
  background: ${ COLORS.BLACK };

  &::before {
    background-color: ${ Color(COLORS.BLACK).alpha(0.1).toString() };
    content: '';
    position: absolute;
    z-index: 2;
    box-shadow: inset 0px 0px 5px 1px ${ COLORS.BLACK };
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
  }
`

export const ScreenText = styled.code`
  position: absolute;
  z-index: 0;
  font-size: 1.5rem;
  color: ${ COLORS.WHITE };
  user-select: none;
  cursor: default;
`

export const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 5px;

  & > span {
    display: flex;
  }
`

export const URLInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Roboto';
  border-radius: 5px;
  background-color: transparent;
  border: none;
  outline: none;
`

export const OuterEdge = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column-reverse;
  width: 2%;
  height: 95%;
  margin: 0 2.5%;
  border-radius: 10px;
  cursor: grab;

  &:active {
    cursor: grabbing !important;
  }
`

export const Name = styled.div`
  width: 1.3rem;
  height: 2.5rem;
  font-size: 1.1rem;
  writing-mode: vertical-lr;
  color: ${ Color(COLORS.WHITE).darken(0.3).hex() };
  transform: rotate(180deg);
  user-select: none;
`

export const SpeakerGrill = styled.div`
  width: 1.45rem;
  height: 12px;
  font-size: 1.25rem;
  writing-mode: vertical-lr;
  letter-spacing: 1px;
  color: ${ Color(COLORS.WHITE).darken(0.6).hex() };
  user-select: none;
`
