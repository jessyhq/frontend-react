// Packages:
import { useRef, useEffect } from 'react'


// Functions:
const useInterval = (
  callback: () => void,
  delay: number = 0
): void => {
  // Ref:
  const savedCallback = useRef<any>()
  // Effects:
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  useEffect(() => {
    const tick = () => {
      savedCallback.current()
    }
    if (delay !== null) {
      const intervalID = setInterval(tick, delay)
      return () => clearInterval(intervalID)
    }
  }, [ delay ])
}


// Exports:
export default useInterval
