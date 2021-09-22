// Packages:
import { useState } from 'react'


// Exports:
export const useInput = (initialValue: string) => {
  // State:
  const [ value, setValue ] = useState(initialValue)
  // Return:
  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value,
      onChange: (event: any) => {
        event.preventDefault()
        event.stopPropagation()
        setValue(event.currentTarget.value)
      },
    },
  }
}
