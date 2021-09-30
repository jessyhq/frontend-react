// Packages:
import styled from 'styled-components'
import Color from 'color'


// Constants:
import COLORS from '../../../styles/colors'


// Exports:
export const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 3vh;
  background-color: ${ Color(COLORS.WHITE).darken(0.025).hex() };
`
