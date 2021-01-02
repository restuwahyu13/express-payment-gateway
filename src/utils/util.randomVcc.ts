export const randomVCC = (): number => {
	const randomVirtualCreditCard: string = Math.random().toString().replace('0.', '')
	const visaCreditCard: any = parseInt(4 + randomVirtualCreditCard)
	const pattern: RegExpExecArray = /\d{16}/.exec(visaCreditCard)
	const ccNumber: string = pattern.join('')
	return typeof +ccNumber === 'number' && +ccNumber
}
