// Packages:
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import xorWith from 'lodash/xorWith'
import isEqual from 'lodash/isEqual'


// Functions:
const isArrayEqual = (x: any[], y: any[]) => size(x) === size(y) && isEmpty(xorWith(x, y, isEqual))


// Exports:
export default isArrayEqual
