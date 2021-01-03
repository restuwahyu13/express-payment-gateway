import { v4 as uuidv4 } from 'uuid'

export const uuid = (): string => uuidv4()

export const uniqueOrderNumber = (): number => {
	const randomOrderNumber: string = Math.random().toString().replace('0.', '')
	const getRandomOrderNumber: any = parseInt(4 + randomOrderNumber)
	const getDigitOrderNumber: RegExpExecArray = /\d{10}/.exec(getRandomOrderNumber)
	const mergeDigitOrderNumber: string = getDigitOrderNumber.join('')
	const resultDigitOrderNumber = typeof +mergeDigitOrderNumber === 'number' && +mergeDigitOrderNumber
	return `bfc-${resultDigitOrderNumber}`
}
