// Packages:
import styled from 'styled-components'
import Color from 'color'


// Constants:
import COLORS from '../../../styles/colors'


// Exports:
export const Wrapper = styled.div<{ width?: number, height?: number, isOn?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: wrap;
  width: ${ props => (props.width ?? 4) * 2.25 }rem;
  height: ${ props => (props.height ?? 2) * (2.25) / 2 }rem;
  padding: 0.5rem;
  border-radius: 5px;
  background-color: dodgerblue;
  box-shadow: inset 0px 0px 5px 0px ${ Color(COLORS.WHITE).darken(0.6).hex() };
  overflow: hidden;
  filter: ${ props => props.isOn ? '' : 'contrast(0.5) brightness(0.5) saturate(0.5)' };
  transition: all 0.25s ease;
`

export const LCDBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.5rem;
  height: 1rem;
  margin: 0.1rem;
  font-family: 'VT323', monospace;
  font-size: 1.2rem;
  color: ${ Color(COLORS.WHITE).darken(0.1).alpha(0.9).toString() };
  text-shadow: 0px 0px 10px ${ Color(COLORS.WHITE).alpha(0.75).toString() };
  background-color: ${ Color('#1e90ff').darken(0.2).alpha(0.5).toString() };
  user-select: none;
  cursor: default;
`

export const LCDBarText = styled.div<{ isOn: boolean }>`
  filter: ${ props => props.isOn ? 'opacity(1)' : 'opacity(0)' };
  transition: all 0.5s ease;
`
