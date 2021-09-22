// Exports:
export const customSplice = (original: string, index: number, absIndex: number, string: string) => original.slice(0, index) + string + original.slice(index + Math.abs(absIndex))
