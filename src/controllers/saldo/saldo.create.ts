import { Request, Response } from 'express'
import knex from '../../database'
import { SaldoDTO } from '../../dto/dto.saldo'
import { TopupsDTO } from '../../dto/dto.topups'

export const createSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const { topup_id, balance }: SaldoDTO = req.body
	const checkTopupId: TopupsDTO[] = await knex<TopupsDTO>('topups').where({ topup_id: topup_id }).select('*')

	if (checkTopupId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'topup id is not exist, in the system'
		})
	}

	const saveSaldo = await knex<SaldoDTO>('saldo')
		.insert({
			topup_id: topup_id,
			balance: balance,
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
		message: 'top up balance successfuly'
	})
}
