// Packages:
import styled from 'styled-components'
import Color from 'color'


// Imports:
import { ImCheckmark } from 'react-icons/im'
import { MdModeEdit, MdDelete } from 'react-icons/md'


// Constants:
import {
  COLORS,
  SECONDARY_COLORS,
  THEME_COLOR
} from '../../../styles/colors'


// Exports:
export const Edge = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  width: 7%;
  margin-left: 0.6rem;
`

export const OptionsEdge = styled(Edge)<{ isVisible: boolean }>`
  align-items: center;
  width: 1rem;
  height: 1rem;
  margin: 0;
  margin-right: 0.6rem;
  filter: ${ props => props.isVisible ? 'opacity(1)' : 'opacity(0)' };
  transition: all 0.25s ease;
`

export const Wrapper = styled.div<{ index: number, mountStatus: -1 | 0 | 1 | 2, isTaskDeleted: { transitionSet: boolean, shouldTransition: boolean, transitioned: boolean } }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1rem;
  margin-bottom: ${ props => props.isTaskDeleted.shouldTransition ? '-3rem' : '0.5rem' };
  padding: 0.8rem 0;
  background-color: ${ SECONDARY_COLORS.WRAPPER.TRANSPARENT.PASSIVE(220).darken(0.4).alpha(0.5).toString() };
  border-radius: 5px;
  filter: ${ props => (props.isTaskDeleted.shouldTransition || props.mountStatus === -1) ? 'opacity(0)' : 'opacity(1)' };
  transform: ${
    props => props.isTaskDeleted.transitionSet ?
      props.isTaskDeleted.shouldTransition ?
        'scale(0.9) !important'
      :
        'scale(1) !important'
    :
      props.mountStatus === 1 ?
        ''
      :
        props.mountStatus === -1 ?
          'translate(0px, 20px) !important'
        :
          'translate(0px, 0px) !important'
  };
  transition: background-color 0.25s ease;
  transition: ${
    props => props.isTaskDeleted.transitionSet ?
      props.isTaskDeleted.shouldTransition ?
        'all 0.25s ease !important'
      :
        'all 0s !important'
    :
      props.mountStatus === 1 ?
        ''
      :
        `all 0.25s ease ${ Math.min(0.1 * props.index, 2.5) }s !important`
  };

  &:hover {
    background-color: ${ SECONDARY_COLORS.WRAPPER.TRANSPARENT.ACTIVE(220).darken(0.4).alpha(0.5).toString() };
  }

  &:hover ${ OptionsEdge } {
    filter: opacity(1);
    transition: all 0.25s ease;
  }
`

export const CheckmarkIcon = styled(ImCheckmark)<{ isvisible: string }>`
  font-size: 0.7rem;
  color: ${ props => props.isvisible === 'true' ? SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() : 'transparent' };
  transition: all 0.25s ease;
`

export const Checkbox = styled.div<{ isChecked: boolean, isClickable: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 5px;
  border: 1px solid ${
    props => props.isChecked ?
      THEME_COLOR.OCEAN
    :
      props.isClickable ?
        SECONDARY_COLORS.BORDER_COLOR.DARK(220).lighten(0.7).alpha(1).toString()
      :
        'transparent'
    };
  background-color: ${
    props => props.isChecked ?
      Color(THEME_COLOR.OCEAN).alpha(0.5).toString()
    :
      props.isClickable ?
        SECONDARY_COLORS.WRAPPER.SOLID.DARK.lighten(0.2).alpha(0.5).toString()
      :
        SECONDARY_COLORS.WRAPPER.SOLID.DARK.lighten(0.2).alpha(0.3).toString()
  };
  cursor: ${ props => props.isClickable ? 'pointer' : 'default' };
  transition: all 0.25s ease;

  &:hover {
    
    transition: all 0.25s ease;
  }

  &:hover ${ CheckmarkIcon } {
    color: ${
      props => props.isChecked ?
        SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.lighten(0.2).hex()
      :
        props.isClickable ?
          SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex()
        :
          ''
    };
    transition: all 0.25s ease;
  }
`

export const TaskTitle = styled.div<{ isNotPointy?: boolean }>`
  display: flex;
  align-items: center;
  width: 86%;
  height: 2.5rem;
  margin-left: 0.6rem;
  font-weight: 500;
  color: ${ COLORS.BLACK };
  line-height: 1.2rem;
  cursor: ${ props => props.isNotPointy ? 'unset' : 'pointer' };
`

export const LineSVG = styled.svg`
  position: absolute;
  max-width: 67%;
`

export const TitleInput = styled.input`
  width: 100%;
  height: 100%;
  margin-bottom: 0.1rem;
  margin-left: -0.125rem;
  font-weight: 500;
  font-size: 1rem;
  color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  line-height: 1.1rem;
  background-color: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: ${ SECONDARY_COLORS.ELEMENT.PLACEHOLDER.DARK.lighten(0.2).hex() };
  }
`

export const Title = styled.div<{ isStrikethrough: boolean }>`
  position: relative;
  color: ${ props => props.isStrikethrough ? SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() : SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  cursor: default;
  transition: all 0.25s ease;
`

export const DoneIcon = styled(ImCheckmark)<{ isvisible: string }>`
  position: absolute;
  margin-right: 0.2rem;
  padding: ${ props => props.isvisible === 'true' ? '0.6rem' : '0rem' };
  font-size: 1.1rem;
  color: ${ SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() };
  filter: ${ props => props.isvisible === 'true' ? 'opacity(1)' : 'opacity(0)' };
  transform: ${ props => props.isvisible === 'true' ? 'scale(1)' : 'scale(0.8)' };
  user-select: none;
  cursor: ${ props => props.isvisible === 'true' ? 'pointer' : 'default' };
  transition: all 0.25s ease;

  &:hover {
    color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
    transition: all 0.25s ease;
  }
`

export const EditIcon = styled(MdModeEdit)<{ isvisible: string }>`
  position: absolute;
  margin-left: ${ props => props.isvisible === 'true' ? '0rem' : '-2rem' };
  padding: ${ props => props.isvisible === 'true' ? '0.5rem' : '0rem' };
  font-size: ${ props => props.isvisible === 'true' ? '1.25rem' : '0rem' };
  color: ${ SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() };
  user-select: none;
  cursor: pointer;
  transition: color 0.25s ease, margin 0.5s ease, font-size 0.5s ease;

  &:hover {
    color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
    transition: all 0.25s ease;
  }
`

export const DeleteIcon = styled(MdDelete)<{ isvisible: string }>`
  position: absolute;
  margin-right: ${ props => props.isvisible === 'true' ? '0rem' : '-2rem' };
  padding: ${ props => props.isvisible === 'true' ? '0.5rem' : '0rem' };
  font-size: ${ props => props.isvisible === 'true' ? '1.25rem' : '0rem' };
  color: ${ SECONDARY_COLORS.ELEMENT.PASSIVE.DARK.hex() };
  user-select: none;
  cursor: pointer;
  transition: color 0.25s ease, margin 0.5s ease, font-size 0.5s ease;

  &:hover {
    color: ${ SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() };
    transition: all 0.25s ease;
  }
`
