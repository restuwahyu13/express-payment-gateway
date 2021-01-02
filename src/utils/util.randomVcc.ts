export const randomVCC = (): number => {
	const cc = 4728398706189983
	const randomVirtualCreditCard = Math.random(cc).toString().replace('0.', '')
	const visaCreditCard = 4 + randomVirtualCreditCard
	const pattern = /\d{16}/.exec(+visaCreditCard).join('')
	return typeof +pattern === 'number' && +pattern
}
