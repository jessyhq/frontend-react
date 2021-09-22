// Packages:
import React from 'react'
import styled from 'styled-components'
import Color from 'color'


// Constants:
import COLORS from '../../styles/colors'
import Music from '../../components/extensions/Music'
import TodoList from '../../components/extensions/TodoList'


// Styles:
const Wrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${ COLORS.WHITE };
  opacity: 0.6;
  background-image: radial-gradient(${ Color(COLORS.BLACK).lighten(5).toString() } 1.15px, ${ COLORS.WHITE } 1.15px);
  background-size: 1.5rem 1.5rem;
  background-position: center;
`


// Functions:
const App = () => {
  return (
    <Wrapper>
      <Background />
      {/* <Music /> */}
      <TodoList />
    </Wrapper>
  )
}


// Exports:
export default App
