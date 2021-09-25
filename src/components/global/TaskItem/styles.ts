// Packages:
import styled from 'styled-components'
import Color from 'color'


// Imports:
import { ImCheckmark } from 'react-icons/im'
import { MdMoreVert, MdModeEdit, MdDelete } from 'react-icons/md'


// Constants:
import COLORS from '../../../styles/colors'


// Exports:
export const Edge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7%;
  height: 100%;
`

export const OptionsEdge = styled(Edge)<{ shouldHideWhenNotHovering: boolean }>`
  filter: ${ props => props.shouldHideWhenNotHovering ? 'opacity(1)' : 'opacity(0)' };
  transition: all 0.25s ease;
`

export const Wrapper = styled.div<{ index: number, mountStatus: -1 | 0 | 1 | 2, isTaskDeleted: { transitionSet: boolean, shouldTransition: boolean, transitioned: boolean } }>`
  display: flex;
  align-items: center;
  width: 92%;
  height: 2rem;
  margin-right: 1%;
  margin-bottom: ${ props => props.isTaskDeleted.shouldTransition ? '-3rem' : '0.75rem' };
  padding: 0.5rem 4%;
  background-color: ${ COLORS.WHITE };
  border-radius: 15px;
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

  &:hover ${ OptionsEdge } {
    filter: opacity(1);
    transition: all 0.25s ease;
  }
`

export const HalfGrabIcon = styled(MdMoreVert)`
  position: absolute;
  width: 1.25rem;
  height: 3rem;
  margin-left: -0.5rem;
  color: ${ Color(COLORS.WHITE).darken(0.75).alpha(0.4).toString() };
  user-select: none;
  transition: all 0.25s ease;
`

export const GrabHandle = styled(Edge)`
  width: 6%;
  margin-left: 1%;
  pointer-events: auto;
  transition: all 0.25s ease, transform 0s;

  &:hover ${ HalfGrabIcon } {
    color: ${ Color(COLORS.WHITE).darken(0.75).toString() };
    transition: all 0.25s ease;
  }

  &:active:hover ${ HalfGrabIcon } {
    color: ${ Color(COLORS.WHITE).darken(0.75).toString() };
    transition: all 0.25s ease;
  }

  &:active:hover {
    cursor: grabbing;
  }
`

export const CheckmarkIcon = styled(ImCheckmark)<{ isvisible: string }>`
  font-size: 0.75rem;
  margin-right: 1px;
  color: ${ props => props.isvisible === 'true' ? Color(COLORS.WHITE).darken(0.75).toString() : Color(COLORS.WHITE).darken(0.75).alpha(0.25).toString() };
  transition: all 0.25s ease;
`

export const Checkbox = styled.div<{ isChecked: boolean, isClickable: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 5px;
  background-color: ${ Color(COLORS.WHITE).darken(0.25).alpha(0.5).toString() };
  cursor: ${ props => props.isClickable ? 'pointer' : 'default' };
  transition: all 0.25s ease;

  &:hover {
    box-shadow: ${ props => props.isClickable ? 'inset 0px 0px 5px 0px ' + Color(COLORS.WHITE).darken(0.25).hex() : '' };
    transition: all 0.25s ease;
  }

  &:hover ${ CheckmarkIcon } {
    color: ${
      props => props.isChecked ?
        Color(COLORS.WHITE).darken(0.75).toString()
      :
        props.isClickable ?
          Color(COLORS.WHITE).darken(0.75).alpha(0.5).toString()
        :
          ''
    };
    transition: all 0.25s ease;
  }
`

export const Middle = styled.div`
  display: flex;
  align-items: center;
  width: 73%;
  height: 100%;
  margin: 0 3%;
  font-weight: 500;
  color: ${ COLORS.BLACK };
`

export const LineSVG = styled.svg`
  position: absolute;
  z-index: -1;
  max-width: 67%;
`

export const TitleInput = styled.input`
  margin-left: -1%;
  font-weight: 500;
  font-size: 1rem;
  background-color: transparent;
  border: none;
  outline: none;
`

export const Title = styled.div<{ isStrikethrough: boolean }>`
  position: relative;
  color: ${ props => props.isStrikethrough ? Color(COLORS.WHITE).darken(0.75).alpha(0.6).toString() : 'inherit' };
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
  cursor: default;
  transition: all 0.25s ease;
`

export const DoneIcon = styled(ImCheckmark)<{ isvisible: string }>`
  position: absolute;
  font-size: 1.25rem;
  color: ${ Color(COLORS.WHITE).darken(0.75).alpha(0.4).toString() };
  filter: ${ props => props.isvisible === 'true' ? 'opacity(1)' : 'opacity(0)' };
  transform: ${ props => props.isvisible === 'true' ? 'scale(1)' : 'scale(0.8)' };
  user-select: none;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: lightseagreen;
    transition: all 0.25s ease;
  }
`

export const EditIcon = styled(MdModeEdit)<{ isvisible: string }>`
  position: absolute;
  margin-left: ${ props => props.isvisible === 'true' ? '0rem' : '-2rem' };
  font-size: ${ props => props.isvisible === 'true' ? '1.25rem' : '0rem' };
  color: ${ Color(COLORS.WHITE).darken(0.75).alpha(0.4).toString() };
  user-select: none;
  cursor: pointer;
  transition: color 0.25s ease, margin 0.5s ease, font-size 0.5s ease;

  &:hover {
    color: ${ Color(COLORS.WHITE).darken(0.75).toString() };
    transition: all 0.25s ease;
  }
`

export const DeleteIcon = styled(MdDelete)<{ isvisible: string }>`
  position: absolute;
  margin-right: ${ props => props.isvisible === 'true' ? '0rem' : '-2rem' };
  font-size: ${ props => props.isvisible === 'true' ? '1.25rem' : '0rem' };
  color: ${ Color(COLORS.WHITE).darken(0.75).alpha(0.4).toString() };
  user-select: none;
  cursor: pointer;
  transition: color 0.25s ease, margin 0.5s ease, font-size 0.5s ease;

  &:hover {
    color: palevioletred;
    transition: all 0.25s ease;
  }
`

export const BoxShadow = styled.span`
  position: absolute;
  z-index: -1;
  left: 0%;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transition: all 0.25s ease;
`
