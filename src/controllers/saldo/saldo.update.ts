import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { SaldoDTO } from '../../dto/dto.saldo'
import { UsersDTO } from '../../dto/dto.users'

export const updateSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const { user_id, total_balance }: SaldoDTO = req.body

	if (total_balance <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'mininum balance Rp 50.000'
		})
	}

	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: user_id }).select('*')
	const checkSaldoId: SaldoDTO[] = await knex<SaldoDTO>('saldo').where({ saldo_id: req.params.id }).select('*')

	if (checkUserId.length < 1 || checkSaldoId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id or saldo id is not exist, update data saldo failed'
		})
	}

	const updateSaldo: number = await knex<SaldoDTO>('saldo').where({ saldo_id: checkSaldoId[0].saldo_id }).update({
		user_id: user_id,
		total_balance: total_balance,
		updated_at: new Date()
	})

	if (updateSaldo < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'update data saldo failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'update data saldo successfully'
	})
}
