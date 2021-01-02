export const randomVCC = (): number => {
	const cc = 4728398706189983
	const randomVirtualCreditCard = Math.random(cc).toString().replace('0.', '')
	return randomVirtualCreditCard
}
