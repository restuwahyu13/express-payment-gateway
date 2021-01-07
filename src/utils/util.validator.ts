import { Request } from 'express'
import { check, validationResult, ValidationError, ValidationChain, Result } from 'express-validator'

export const expressValidator = (req: Request): ValidationError[] => {
	const errors: Result<ValidationError> = validationResult(req)
	const messages: ValidationError[] = []
	if (!errors.isEmpty()) {
		for (const i of errors.array()) {
			messages.push(i)
		}
	}
	return messages
}

export const paramsValiator = (): ValidationChain[] => [
	check('íd').isEmpty().withMessage('id is required'),
	check('id').not().isNumeric().withMessage('id must be number')
]

export const registerValidator = (): ValidationChain[] => [
	check('email').isEmpty().withMessage('email is required'),
	check('email').not().isEmail().withMessage('email is not valid'),
	check('password').isEmpty().withMessage('password is required'),
	check('password').not().isLength({ min: 8 }).withMessage('password must be at least 8 characters')
]

export const loginValidator = (): ValidationChain[] => [
	check('email').isEmpty().withMessage('email is required'),
	check('email').not().isEmail().withMessage('email is not valid'),
	check('password').isEmpty().withMessage('pasword is required')
]

export const emailValidator = (): ValidationChain[] => [
	check('email').isEmpty().withMessage('email is required'),
	check('email').not().isEmail().withMessage('email is not valid')
]

export const tokenValidator = (): ValidationChain[] => [
	check('token').isEmpty().withMessage('token is required'),
	check('token').not().isJWT().withMessage('token is not valid')
]

export const topupValidator = (): ValidationChain[] => [
	check('user_id').isEmpty().withMessage('user_id is required'),
	check('user_id').not().isNumeric().withMessage('id must be a number'),
	check('topup_amount').isEmpty().withMessage('topup_amount is required'),
	check('topup_amount').not().isNumeric().withMessage('topup_amount must be a number'),
	check('topup_method').not().isEmpty().withMessage('topup_method is required')
]
export const transferValidator = (): ValidationChain[] => [
	check('transfer_from').isEmpty().withMessage('code transfer is required'),
	check('transfer_from').not().isNumeric().withMessage('code transfer must be a number'),
	check('transfer_to').isEmpty().withMessage('code transfer is required'),
	check('transfer_to').not().isNumeric().withMessage('code transfer must be a number'),
	check('transfer_amount').isEmpty().withMessage('code transfer is required'),
	check('transfer_amount').not().isNumeric().withMessage('code transfer must be a number')
]
