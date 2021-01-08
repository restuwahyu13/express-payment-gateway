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

	if (req.body.total_balance <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'mininum saldo Rp 50.000'
		})
	}

	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: req.body.user_id }).select('*')
	const checkSaldoUserId: SaldoDTO[] = await knex<SaldoDTO>('saldo').where({ user_id: req.body.user_id }).select('*')

	if (checkUserId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, add saldo failed'
		})
	}

	if (checkSaldoUserId.length > 0) {
		return res.status(409).json({
			status: res.statusCode,
			method: req.method,
			message: 'saldo user id already exist, add saldo failed'
		})
	}

	const saveSaldo = await knex<SaldoDTO>('saldo')
		.insert({ user_id: checkUserId[0].user_id, total_balance: req.body.total_balance, created_at: new Date() })
		.returning('*')

	if (Object.keys(saveSaldo[0]).length < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'add saldo failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'add saldo successfully'
	})
}
