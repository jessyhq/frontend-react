// Packages:
import styled from 'styled-components'
import Color from 'color'


// Constants:
import { COLORS } from '../../../styles/colors'



// Exports:
export const Button = styled.div<{ width?: number, height?: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${ props => (props.width ?? 1) * 3.25 }rem;
  height: ${ props => (props.height ?? 1) * 3.25 }rem;
  margin: 2px;
  margin-top: 5px;
  border-radius: 5px;
  background-color: ${ Color(COLORS.WHITE).darken(0.05).hex() };
  box-shadow: 0px 0px 5px 1px ${ COLORS.BLACK };
  color: ${ COLORS.BLACK };
`

export const Knob = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  box-shadow: ${ props => props.selected ? `inset 0px 0px 5px -2px ${ Color(COLORS.WHITE).darken(0.6).hex() }` : `0.5px 1px 6px 0px ${ Color(COLORS.WHITE).darken(0.6).hex() }` };
  cursor: ${ props => props.selected ? 'default' : 'pointer' };
  transition: all 0.1s ease;

  &:active {
    box-shadow: ${ props => props.selected ? `inset 0.5px 1px 6px 0px ${ Color(COLORS.WHITE).darken(0.6).hex() }` : `0px 0px 0px 0px ${ Color(COLORS.WHITE).darken(0.6).hex() }` };
    transition: all 0.1s ease;
  }
`

export const LEDLight = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  margin-right: 1px;
  border-radius: 50%;
  background-color: ${ props => props.active ? 'lightseagreen' : 'palevioletred' };
  box-shadow: 
    0 1px 3px 0px rgba(0, 0, 0, 0.25),
    inset 0 3px 4px 0px rgba(255, 255, 255, 0.3),
    inset 0 -5px 5px ${ props => props.active ? 'rgba(0, 255, 200, 0.4)' : 'rgba(255, 0, 0, 0.4)' },
    inset 0 5px 10px -5px rgba(255, 255, 255, 0.3);
`

const PushButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 29px;
  height: 29px;
  border-radius: 50%;
  background: radial-gradient(${ Color(COLORS.WHITE).darken(0.35).desaturate(1).hex() } 50%, ${ Color(COLORS.WHITE).darken(0.025).hex() } 60%); // a0a0a0
  /* box-shadow: inset 1px 1px 1px 3px ${ Color(COLORS.WHITE).darken(0.025).hex() }; */
  transition: all 0.1s ease;
`

const PushButtonThumb = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background-color: ${ Color(COLORS.WHITE).darken(0.025).hex() };
  box-shadow: inset -1px -1px 3px -2px ${ Color(COLORS.WHITE).darken(0.4).hex() }, 0px 0px 3px -1px ${ Color(COLORS.WHITE).darken(0.4).hex() };
  font-size: 0.5rem;
  user-select: none;
  cursor: pointer;
  transition: all 0.1s ease;

  &:active {
    box-shadow: inset 0px 0px 3px 1px ${ Color(COLORS.WHITE).darken(0.4).hex() }, 0px 0px 2px 1px ${ Color(COLORS.WHITE).darken(0.4).hex() };
    transition: all 0.1s ease;
  }
`

export const PushButton = ({ child }: { child?: any }) => {
  return (
    <PushButtonWrapper>
      <PushButtonThumb>
        { child }
      </PushButtonThumb>
    </PushButtonWrapper>
  )
}
