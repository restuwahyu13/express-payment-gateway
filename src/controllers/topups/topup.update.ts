import { Request, Response } from 'express'
import knex from '../../database'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'

export const updateTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	const { user_id, topup_no, topup_amount, topup_method }: TopupsDTO = req.body

	const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: user_id }).select()
	const findTopup: TopupsDTO[] = await knex<TopupsDTO>('topups').where({ topup_id: req.params.id }).select('topup_id')

	if (findUser.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, cannot update data topup'
		})
	}

	if (findTopup.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'topup id is not exist, cannot update data topup'
		})
	}

	const updateTopup: number = await knex<TopupsDTO>('knex').where({ topup_id: findTopup[0].topup_id }).update({
		user_id: user_id,
		topup_no: topup_no,
		topup_amount: topup_amount,
		topup_method: topup_method
	})

	if (updateTopup < 1) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			message: 'update data topup failed, please try again'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'update data topup successfully'
	})
}
