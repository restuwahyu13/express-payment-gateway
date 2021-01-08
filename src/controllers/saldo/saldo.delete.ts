import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { SaldoDTO } from '../../dto/dto.saldo'
import { UsersDTO } from '../../dto/dto.users'

export const deleteSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: req.params.id }).select('*')
	const checkSaldoId: SaldoDTO[] = await knex<SaldoDTO>('saldo').where({ saldo_id: req.params.id }).select('*')

	if (checkUserId.length < 1 || checkSaldoId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id or saldo id is not exist, delete data saldo failed'
		})
	}

	const deleteSaldo: number = await knex<SaldoDTO>('saldo').where({ saldo_id: checkSaldoId[0].saldo_id }).delete()

	if (deleteSaldo < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'delete data saldo failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'delete data saldo successfully'
	})
}
