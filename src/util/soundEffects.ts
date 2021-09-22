// Imports:
import {
  buttonPressSoundEffects,
  strikeThroughSoundEffects
} from '../assets'


// Exports:
export const playButtonPress = () => {
  const audio = new Audio(buttonPressSoundEffects[ Math.floor(Math.random() * buttonPressSoundEffects.length) ])
  audio.volume = 0.1
  audio.play()
}

export const playStrikeThrough = () => {
  const audio = new Audio(strikeThroughSoundEffects[ Math.floor(Math.random() * strikeThroughSoundEffects.length) ])
  audio.volume = 0.2
  audio.play()
}
