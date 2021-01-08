import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { WithdrawDTO } from '../../dto/dto.withdraw'

export const deleteWithdraw = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const checkWithdrawId: WithdrawDTO[] = await knex<WithdrawDTO>('withdraw')
		.where({ withdraw_id: req.params.id })
		.select('*')

	if (checkWithdrawId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'withdraw id is not exist, delete data withdraw failed'
		})
	}

	const deleteWithdraw: number = await knex<WithdrawDTO>('withdraw')
		.where({ withdraw_id: checkWithdrawId[0].withdraw_id })
		.delete()

	if (deleteWithdraw < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'delete data withdraw failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'delete data withdraw successfully'
	})
}
