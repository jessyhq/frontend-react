// Packages:
import React, { useState } from 'react'
import styled from 'styled-components'
import Color from 'color'
import GridLayout, { WidthProvider } from 'react-grid-layout'


// Constants:
import COLORS from '../../styles/colors'
import { EXTENSION } from '../../constants/extensions'


// Styles:
const Wrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 97vh;
`

const Background = styled.div`
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 97vh;
  background-color: ${ COLORS.WHITE };
  opacity: 0.6;
  background-image: radial-gradient(${ Color(COLORS.BLACK).lighten(5).toString() } 1.15px, ${ COLORS.WHITE } 1.15px);
  background-size: 1.5rem 1.5rem;
  background-position: center;
`


// Functions:
const GridLayoutWithWidth = WidthProvider(GridLayout)

const App = () => {
  // Experimental Constants:
  const [ extensions, setExtensions ] = useState([
    {
      _id: 'some-id-1',
      type: EXTENSION.MUSIC.type
    },
    {
      _id: 'some-id-2',
      type: EXTENSION.TODO_LIST.type
    },
    {
      _id: 'some-id-3',
      type: EXTENSION.TODO_LIST.type
    }
  ])
  const [ layout, setLayout ] = useState<GridLayout.Layout[]>([
    { i: 'some-id-1', x: 0, y: 48, w: 35 + 1, h: 8 + 2 },
    { i: 'some-id-2', x: 27, y: 0, w: 25 + 2, h: 35 + 1 },
    { i: 'some-id-3', x: 0, y: 0, w: 25 + 2, h: 35 + 1 }
  ])

  // Return:
  return (
    <>
      {
        window.innerWidth >= 1024 ?
        <Wrapper>
          <Background />
          <GridLayoutWithWidth
            className='layout'
            cols={ window.innerWidth / 16 }
            rowHeight={ 16 }
            margin={[ 0, 0 ]}
            isResizable
            isBounded
            preventCollision
            compactType={ null }
            layout={ layout }
            onLayoutChange={ layout => setLayout(layout) }
            draggableCancel='.draggableCancel'
          >
            {
              extensions.map(extension => <span key={ extension._id } >{ EXTENSION[ extension.type ].component({ _id: extension._id }) }</span>)
            }
          </GridLayoutWithWidth>
        </Wrapper>
        :
        <></>
      }
    </>
  )
}


// Exports:
export default App
