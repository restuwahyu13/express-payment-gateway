export const paymentMethodValidator = (payment_method: string): boolean => {
	const paymentRules = [
		'alfamart',
		'indomart',
		'lawson',
		'dana',
		'ovo',
		'gopay',
		'linkaja',
		'jenius',
		'fastpay',
		'kudo',
		'bri',
		'mandiri',
		'bca',
		'bni',
		'bukopin',
		'e-banking',
		'visa',
		'mastercard',
		'discover',
		'american express',
		'paypal'
	].includes(payment_method.toLowerCase())

	if (!paymentRules) return false
	return true
}
