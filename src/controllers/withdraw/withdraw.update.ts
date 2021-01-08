import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { UsersDTO } from '../../dto/dto.users'
import { WithdrawDTO } from '../../dto/dto.withdraw'

export const updateWithdraw = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const { user_id, withdraw_amount }: WithdrawDTO = req.body

	if (withdraw_amount <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'mininum withdraw balance Rp 50.000'
		})
	}

	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: user_id }).select('*')
	const checkWithdrawId: WithdrawDTO[] = await knex<WithdrawDTO>('withdraw')
		.where({ withdraw_id: req.params.id })
		.select('*')

	if (checkUserId.length < 1 || checkWithdrawId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id or withdraw id is not exist, update data withdraw failed'
		})
	}

	const updateWithdraw: number = await knex<WithdrawDTO>('withdraw')
		.where({ withdraw_id: checkWithdrawId[0].withdraw_id })
		.update({
			user_id: user_id,
			withdraw_amount: withdraw_amount,
			updated_at: new Date()
		})

	if (updateWithdraw < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'update data withdraw failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'update data withdraw successfully'
	})
}
