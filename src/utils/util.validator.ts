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
	check('id').notEmpty().withMessage('id is required'),
	check('id').isNumeric().withMessage('id must be number')
]

export const registerValidator = (): ValidationChain[] => [
	check('email').isEmpty().withMessage('email is required'),
	check('email').isEmail().withMessage('email is not valid'),
	check('password').isEmpty().withMessage('password is required'),
	check('password').isLength({ min: 8 }).withMessage('password must be at least 8 characters')
]

export const loginValidator = (): ValidationChain[] => [
	check('email').notEmpty().withMessage('email is required'),
	check('email').isEmail().withMessage('email is not valid'),
	check('password').notEmpty().withMessage('pasword is required')
]

export const emailValidator = (): ValidationChain[] => [
	check('email').notEmpty().withMessage('email is required'),
	check('email').isEmail().withMessage('email is not valid')
]

export const tokenValidator = (): ValidationChain[] => [
	check('token').notEmpty().withMessage('token is required'),
	check('token').isJWT().withMessage('token is not valid')
]

export const topupValidator = (): ValidationChain[] => [
	check('user_id').notEmpty().withMessage('user_id is required'),
	check('user_id').isNumeric().withMessage('user_id must be a number'),
	check('topup_amount').notEmpty().withMessage('topup_amount is required'),
	check('topup_amount').isNumeric().withMessage('topup_amount must be a number'),
	check('topup_method').notEmpty().withMessage('topup_method is required')
]

export const transferValidator = (): ValidationChain[] => [
	check('transfer_from').notEmpty().withMessage('transfer_from is required'),
	check('transfer_from').isNumeric().withMessage('transfer_from must be a number'),
	check('transfer_to').notEmpty().withMessage('transfer_to is required'),
	check('transfer_to').isNumeric().withMessage('transfer_to must be a number'),
	check('transfer_amount').notEmpty().withMessage('transfer_amount is required'),
	check('transfer_amount').isNumeric().withMessage('transfer_amount must be a number')
]

export const saldoValidator = (): ValidationChain[] => [
	check('user_id').notEmpty().withMessage('user_id is required'),
	check('user_id').isNumeric().withMessage('user_id must be a number'),
	check('total_balance').notEmpty().withMessage('total_balance is required'),
	check('total_balance').isNumeric().withMessage('total_balance must be a number')
]

export const withdrawValidator = (): ValidationChain[] => [
	check('user_id').notEmpty().withMessage('user_id is required'),
	check('user_id').isNumeric().withMessage('user_id must be a number'),
	check('withdraw_amount').notEmpty().withMessage('withdraw_amount is required'),
	check('withdraw_amount').isNumeric().withMessage('withdraw_amount must be a number')
]

export const adminValidator = (): ValidationChain[] => [
	check('email').notEmpty().withMessage('email is required'),
	check('email').isEmail().withMessage('email is not valid'),
	check('password').notEmpty().withMessage('password is required'),
	check('password').isLength({ min: 8 }).withMessage('password must be at least 8 characters'),
	check('active').notEmpty().withMessage('active is required'),
	check('active').isBoolean().withMessage('active must be a boolean'),
	check('role').notEmpty().withMessage('role is required'),
	check('role').isString().withMessage('role must be a string')
]
