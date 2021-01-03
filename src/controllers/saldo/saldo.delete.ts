import { Request, Response } from 'express'
import knex from '../../database'
import { SaldoDTO } from '../../dto/dto.saldo'

export const deleteSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const findSaldo: SaldoDTO[] = await knex<SaldoDTO>('saldo').where({ saldo_id: req.params.id }).select('saldo_id')

	if (findSaldo.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'saldo id is not exist, cannot delete data saldo'
		})
	}

	const deleteSaldo: number = await knex<TopupsDTO>('knex').where({ saldo_id: findSaldo[0].saldo_id }).delete()

	if (deleteSaldo < 1) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			message: 'delete data saldo failed, please try again'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'delete data saldo successfully'
	})
}
