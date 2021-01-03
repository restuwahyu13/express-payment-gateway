import { Request, Response } from 'express'
import knex from '../../database'
import { SaldoDTO } from '../../dto/dto.saldo'
import { TopupsDTO } from '../../dto/dto.topups'

export const updateSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const { topup_id, balance }: SaldoDTO = req.body

	const findTopup: TopupsDTO[] = await knex<TopupsDTO>('topups').where({ topup_id: topup_id }).select('topup_id')
	const findSaldo: SaldoDTO[] = await knex<SaldoDTO>('saldo').where({ saldo_id: req.params.id }).select('saldo_id')

	if (findTopup.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'topup id is not exist, cannot update data saldo'
		})
	}

	if (findSaldo.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'saldo id is not exist, cannot update data saldo'
		})
	}

	const updateSaldo: number = await knex<TopupsDTO>('knex').where({ saldo_id: findSaldo[0].saldo_id }).update({
		topup_id: topup_id,
		balance: balance,
		updated_at: new Date()
	})

	if (updateSaldo < 1) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			message: 'update data saldo failed, please try again'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'update data saldo successfully'
	})
}
