// Styles:
import {
  LCDBar,
  LCDBarText,
  Wrapper
} from './styles'


// Functions:
const LCDScreen = ({ dimensions, isOn, charArray }: { dimensions: { W: number, H: number }, isOn: boolean, charArray: string[] }) => {
  return (
    <Wrapper width={ dimensions.W } height={ dimensions.H } isOn={ isOn }>
      { [ ...Array(2 * Math.floor((dimensions.W * 2.25) / 0.7)) ].map((_e, i) =>
        <LCDBar key={ i }>
          <LCDBarText isOn={ isOn }>{ charArray[i] ?? '' }</LCDBarText>
        </LCDBar>
      )}
    </Wrapper>
  )
}


// Exports:
export default LCDScreen
