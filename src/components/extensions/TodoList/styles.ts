// Packages:
import styled from 'styled-components'
import Color from 'color'


// Constants:
import COLORS from '../../../styles/colors'
import { SMOOTH_INNER_SHADOW, SMOOTH_SHADOW } from '../../../styles'


// Exports:
export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 25rem;
  height: 35rem;
  /* margin: 0.75rem; */
  padding: 1rem;
  padding-bottom: 0;
  background-color: ${ Color(COLORS.WHITE).darken(0.025).hex() };
  border-radius: 10px;
  box-shadow: ${ SMOOTH_INNER_SHADOW };
  
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
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 91%;
  /* margin-top: 5%; */
  padding-bottom: 0.2rem;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px -1px ${ Color(COLORS.WHITE).darken(0.5).hex() }, 0px 0px 5px 0px ${ Color(COLORS.WHITE).darken(0.25).hex() };
  background-color: ${ Color(COLORS.BLACK).lighten(1).hex() };
`

export const ScreenContainer = styled.div<{ isOn: boolean }>`
  position: relative;
  width: 91%;
  height: 73%;
  margin: 3%;
  padding: 1%;
  padding-top: 6%;
  padding-right: 2%;
  background-color: ${ props => props.isOn ? Color(COLORS.WHITE).darken(0.05).hex() : COLORS.BLACK };
  border-radius: 10px;
  box-shadow:
    inset 0px 0px 10px 0px ${ props => props.isOn ? Color(COLORS.WHITE).darken(0.2).saturate(5).hex() : Color(COLORS.WHITE).darken(0.75).hex() },
    0px 0px 5px 0px ${ props => props.isOn ? Color(COLORS.WHITE).darken(0.3).saturate(3).hex() : Color(COLORS.WHITE).darken(0.75).desaturate(0.5).hex() };
  transition: all 0.25s ease;
`

export const UntouchabilityLayer = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  border-radius: 10px;
`

export const Screen = styled.div<{ isOn: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  filter: ${ props => props.isOn ? 'opacity(1)' : 'opacity(0)' };
  transition: all 0.25s ease;
`

export const Placeholder = styled.div`
  position: relative;
  color: ${ Color(COLORS.WHITE).darken(0.5).hex() };
  font-weight: 500;
  font-size: 1rem;
  user-select: none;
  cursor: pointer;
  transition: all 0.25s ease;
`

export const AddTask = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 92%;
  height: 2rem;
  margin-right: 1%;
  margin-bottom: 0.75rem;
  padding: 0.5rem 4%;
  background-color: ${ Color(COLORS.WHITE).darken(0.1).hex() };
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background-color: ${ Color(COLORS.PRIMARY).saturate(0.75).alpha(0.25).toString() };
    transition: all 0.25s ease;
  }

  &:hover ${ Placeholder } {
    color: ${ Color(COLORS.PRIMARY).darken(0.25).toString() };
    transition: all 0.25s ease;
  }
`

export const Tasks = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 90%;
  margin: auto;
`

export const TaskItemPlaceholder = styled.div`
  display: flex;
  width: 92%;
  min-height: 3rem;
  margin-right: 1%;
  margin-bottom: 0.75rem;
  padding: 0.5rem 4%;
  box-sizing: border-box;
  flex-shrink: 0;
  flex-grow: 0;
  pointer-events: none;
`

export const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  width: 94%;
  height: 12.5%;
  margin: 3%;
`

export const OuterEdge = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  width: 35%;
  height: 5%;
  margin: 2.5% 0%;
  border-radius: 10px;
`

export const Name = styled.div`
  font-size: 1.1rem;
  color: ${ Color(COLORS.WHITE).darken(0.3).hex() };
  user-select: none;
  cursor: default;
`
