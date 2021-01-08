import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { SaldoDTO } from '../../dto/dto.saldo'
import { SaldoHistoryDTO } from '../../dto/dto.saldoHistory'
import { TopupsDTO } from '../../dto/dto.topups'

export const updateSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const { topup_id, balance }: SaldoHistoryDTO = req.body

	const findTopup: TopupsDTO[] = await knex<TopupsDTO>('topups').where({ topup_id: topup_id }).select('topup_id')
	const findSaldo: SaldoDTO[] = await knex<SaldoDTO>('saldo').where({ saldo_id: req.params.id }).select('saldo_id')

	if (findTopup.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'topup id is not exist, update data saldo failed'
		})
	}

	if (findSaldo.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'saldo id is not exist, update data saldo failed'
		})
	}

	const updateSaldo: number = await knex<TopupsDTO>('knex').where({ saldo_id: findSaldo[0].saldo_id }).update({
		topup_id: topup_id,
		balance: balance,
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
