// Styles:
import { Close, Minimize, Wrapper } from './styles'


// Functions:
const WindowControls = () => {
  return (
    <Wrapper>
      <Minimize style={{ marginRight: '0.75rem' }} />
      <Close style={{ fontSize: '1.1rem' }} />
    </Wrapper>
  )
}


// Exports:
export default WindowControls
