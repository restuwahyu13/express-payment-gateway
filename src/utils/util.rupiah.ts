export const rupiahFormatter = (digit: string): string => {
	const digitNumber = +digit
	const formatter = new Intl.NumberFormat('en-ID', {
		style: 'currency',
		currency: 'IDR'
	})
		.format(digitNumber)
		.replace(/[IDR]/gi, '')
		.replace(/(\.+\d{2})/, '')
		.trimLeft()
	return `Rp ${formatter}`
}
