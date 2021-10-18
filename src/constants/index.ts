// Typescript:
import { PRIORITY_VALUES } from '../components/global/PriorityInput/types'
import { SECONDARY_COLORS } from '../styles/colors'


// Exports:
export enum TIME {
  MILLISECOND = 1,
  SECOND = 1000 * TIME.MILLISECOND,
  MINUTE = 60 * TIME.SECOND,
  HOUR = 60 * TIME.MINUTE,
  DAY = 24 * TIME.HOUR
}

export const PRIORITY_TYPE = {
  [ PRIORITY_VALUES.LOW ]: {
    color: SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hue(200).saturate(1.75).darken(0.25).hex(),
    name: 'low',
    transform: 'translateY(0rem)'
  },
  [ PRIORITY_VALUES.NORMAL ]: {
    color: SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex(),
    name: 'normal',
    transform: 'translateY(-2rem)'
  },
  [ PRIORITY_VALUES.MEDIUM ]: {
    color: SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hue(0).saturate(1.75).darken(0.25).hex(),
    name: 'medium',
    transform: 'translateY(-4rem)'
  },
  [ PRIORITY_VALUES.HIGH ]: {
    color: SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hue(0).saturate(2).darken(0.45).hex(),
    name: 'high',
    transform: 'translateY(-6rem)'
  }
}
