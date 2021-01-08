import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { SaldoDTO } from '../../dto/dto.saldo'
import { UsersDTO } from '../../dto/dto.users'

export const createSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const { user_id, total_balance }: SaldoDTO = req.body
	const checkTopupId: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: user_id }).select('*')

	if (checkTopupId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'topup id is not exist, in the system'
		})
	}

	const saveSaldo = await knex<SaldoDTO>('saldo')
		.insert({
			topup_id: user_id,
			balance: total_balance,
			created_at: new Date()
		})
		.returning('*')

	if (Object.keys(saveSaldo[0]).length < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'top up balance failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'top up balance successfully'
	})
}
