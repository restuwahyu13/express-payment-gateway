import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'

export const updateTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const { user_id, topup_no, topup_amount, topup_method }: TopupsDTO = req.body

	if (topup_amount <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'mininum topup balance Rp 50.000'
		})
	}

	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: user_id }).select('*')
	const checkTopupId: TopupsDTO[] = await knex<TopupsDTO>('topups').where({ topup_id: req.params.id }).select('*')

	if (checkUserId.length < 1 || checkTopupId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id or topup id is not exist, update data topup failed'
		})
	}

	const updateTopup: number = await knex<TopupsDTO>('topups').where({ topup_id: checkTopupId[0].topup_id }).update({
		user_id: user_id,
		topup_no: topup_no,
		topup_amount: topup_amount,
		topup_method: topup_method
	})

	if (updateTopup < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'update data topup failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'update data topup successfully'
	})
}
