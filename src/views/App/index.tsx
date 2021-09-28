// Packages:
import React from 'react'
import styled from 'styled-components'
import Color from 'color'
import GridLayout, { WidthProvider } from 'react-grid-layout'

// Constants:
import COLORS from '../../styles/colors'
import Music from '../../components/extensions/Music'
import TodoList from '../../components/extensions/TodoList'


// Styles:
const Wrapper = styled.div`
  position: absolute;
  /* display: flex;
  justify-content: center;
  align-items: center; */
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
const GridLayoutWithWidth = WidthProvider(GridLayout)

const App = () => {
  return (
      <Wrapper>
        <Background />
        <GridLayoutWithWidth
          className='layout'
          cols={ window.innerWidth / 16 }
          rowHeight={ 16 }
          // width={ window.innerWidth }
          margin={[ 0, 0 ]}
          isResizable
          isBounded
          preventCollision
          compactType={ null }
          // onLayoutChange={ (layout) => console.log(layout) }
        >
          <div key='a' data-grid={{ x: 0, y: 0, w: 35 + 1, h: 8 + 2 }}><Music /></div>
          <div key='b' data-grid={{ x: 0, y: 0, w: 25 + 2, h: 35 + 1 }}><TodoList /></div>
          <div key='c' data-grid={{ x: 35 + 1, y: 0, w: 25 + 2, h: 35 + 1 }}><TodoList /></div>
        </GridLayoutWithWidth>
      </Wrapper>
  )
}


// Exports:
export default App
