// Packages:
import styled, { keyframes } from 'styled-components'
import Color from 'color'


// Imports:
import { IoIosSearch } from 'react-icons/io'


// Constants:
import { COLORS, SECONDARY_COLORS, THEME_COLOR } from '../../../styles/colors'
import { IoOptions } from 'react-icons/io5'
import { RiArrowRightSLine } from 'react-icons/ri'


// Styles:
const fadeInAndRiseUp = keyframes`
  0% {
    filter: opacity(0);
    transform: translateY(20px);
  }
  100% {
    filter: opacity(1);
    transform: translateY(0px);
  }
`


// Exports:
export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 22rem;
  height: 35rem;
  background-color: ${ SECONDARY_COLORS.WIDGET_BACKGROUND.DARK(220).toString() };
  border-radius: 10px;
  border: 1px solid ${ SECONDARY_COLORS.BORDER_COLOR.DARK(220).toString() };
  backdrop-filter: blur(10px);
  animation: 0.5s ${ fadeInAndRiseUp } ease;
`

export const Bar = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.75rem;
  padding: 0.25rem 0rem;
  background-color: ${ SECONDARY_COLORS.WRAPPER.SOLID.DARK.hex() };
  user-select: none;
`

export const TopBar = styled(Bar)`
  top: 0;
  border-radius: 10px 10px 0px 0px;
`

export const TopBarTitle = styled.div`
  margin-left: 1rem;
  margin-bottom: 0.2rem;
  font-weight: 400;
  font-size: 0.9rem;
  color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
`

export const MainArea = styled.div`
  width: 100%;
  height: 100%;
  padding: 2.25rem 0;
  overflow: hidden;
`

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3rem;
  border-bottom: 1px solid ${ SECONDARY_COLORS.BORDER_COLOR.DARK(220).toString() };
`

export const SearchIcon = styled(IoIosSearch)`
  width: 10%;
  margin-right: 0.25rem;
  margin-left: 0.45rem;
  font-size: 1.35rem;
  color: ${ SECONDARY_COLORS.ELEMENT.PLACEHOLDER.DARK.hex() };
`

export const SearchInput = styled.input`
  width: 90%;
  height: 100%;
  font-size: 0.9rem;
  font-weight: 400;
  font-family: 'Inter';
  color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  background-color: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: ${ SECONDARY_COLORS.ELEMENT.PLACEHOLDER.DARK.hex() };
  }
`

export const OptionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  user-select: none;
`

export const ActionButton = styled.span<{ isEnabled: boolean }>`
  margin: 0.5rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
  line-height: 0.9rem;
  color: ${ props => props.isEnabled ? SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() : SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() };
  background-color: ${ props => props.isEnabled ? THEME_COLOR.OCEAN : SECONDARY_COLORS.WRAPPER.TRANSPARENT.PASSIVE(220).alpha(0.7).toString() };
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background-color: ${ props => props.isEnabled ? Color(THEME_COLOR.OCEAN).lighten(0.3).hex() : SECONDARY_COLORS.WRAPPER.TRANSPARENT.PASSIVE(220).alpha(0.7).toString() };
  }

  &:active {
    background-color: ${ props => props.isEnabled ? THEME_COLOR.OCEAN : SECONDARY_COLORS.WRAPPER.TRANSPARENT.PASSIVE(220).alpha(0.7).toString() };
  }
`

export const OptionsIcon = styled(IoOptions)`
  padding: 0.5rem;
  font-size: 1.2rem;
  color: ${ SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() };
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  }

  &:active {
    color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.darken(0.2).hex() };
  }
`

export const ProjectsArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 0;
  user-select: none;
  transition: all 0.25s ease;
`

export const Project = styled.div`
  margin: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
  transition: all 0.25s ease;
`

export const ProjectTitle = styled.div`
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: ${ SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() };
`

export const RightArrow = styled(RiArrowRightSLine)`
  font-size: 1rem;
  filter: opacity(0);
  transition: all 0.25s ease;
`

export const Board = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  padding: 0.5rem;
  color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background-color: ${ SECONDARY_COLORS.WRAPPER.TRANSPARENT.PASSIVE(220).alpha(0.5).toString() };
  }

  &:active {
    background-color: ${ SECONDARY_COLORS.WRAPPER.TRANSPARENT.PASSIVE(220).darken(0.2).alpha(0.5).toString() };
  }

  &:hover ${ RightArrow } {
    filter: opacity(1);
  }
`

export const BoardTitle = styled.div`
  margin-left: 5%;
  font-weight: 500;
  font-size: 1rem;
`

export const BottomBar = styled(Bar)`
  bottom: 0;
  font-size: 0.75rem;
  color: ${ SECONDARY_COLORS.ELEMENT.PLACEHOLDER.DARK.hex() };
  border-radius: 0px 0px 10px 10px;
`

export const ItemCount = styled.div`
  margin-left: 1rem;
  transition: all 0.25s ease;

  &:hover {
    color: ${ SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() };
  }
`

export const LastEdited = styled.div`
  margin-right: 1rem;
  transition: all 0.25s ease;

  &:hover {
    color: ${ SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() };
  }
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
`
