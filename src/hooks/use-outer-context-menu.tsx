// Packages:
import { useRef, useEffect } from 'react'


// Functions:
const useOuterContextMenu = (callback: (e: MouseEvent) => any) => {
  // Ref:
  const callbackRef = useRef<any>()
  const innerRef = useRef<any>()

  // Effects:
  useEffect(() => { callbackRef.current = callback })
  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
    function handleContextMenu(e: MouseEvent) {
      if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target)) callbackRef.current(e)
    }
  }, [])
  
  // Return:
  return innerRef
}


// Exports:
export default useOuterContextMenu

/**
 * Credits: Hook implementation based on Tanner Linsley's excellent talk at JSConf Hawaii 2020
 */
