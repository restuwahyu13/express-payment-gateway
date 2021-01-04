import { Request, Response } from 'express'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import knex from '../../database'
import { TopupsDTO } from '../../dto/dto.topups'
import { SaldoDTO } from '../../dto/dto.saldo'
import { SaldoHistoryDTO } from '../../dto/dto.saldoHistory'
import { LogsDTO } from '../../dto/dto.logs'
import { uniqueOrderNumber } from '../../utils/util.uuid'
import { UsersDTO } from '../../dto/dto.users'
import { tempMailTopup } from '../../templates/template.topup'
import { dateFormat } from '../../utils/util.date'
import { ITopupMail } from '../../interface/i.tempmail'
import { IFindBalanceHistory } from '../../interface/i.saldo'

export const createTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	if (req.body.topup_amount <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'mininum top up balance Rp 50.000'
		})
	}

	const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: req.body.user_id })

	if (findUser.length < 1) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, top up balance failed'
		})
	}

	const saveTopup: TopupsDTO[] = await knex<TopupsDTO>('topups')
		.insert({
			user_id: findUser[0].user_id,
			topup_no: uniqueOrderNumber(),
			topup_amount: req.body.topup_amount,
			topup_method: req.body.topup_method,
			topup_time: dateFormat(new Date()),
			created_at: new Date()
		})
		.returning(['topup_id', 'user_id', 'topup_amount', 'topup_method'])

	if (Object.keys(saveTopup[0]).length < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'top up balance failed, server is busy'
		})
	}

	const { topup_id, user_id, topup_amount, topup_method }: TopupsDTO = saveTopup[0]
	await knex<SaldoHistoryDTO>('saldo_history').insert({
		topup_id: topup_id,
		balance: topup_amount,
		created_at: new Date()
	})

	const checkSaldoUserId: SaldoDTO[] = await knex<SaldoDTO>('saldo').where({ user_id: user_id }).select(['user_id'])

	if (checkSaldoUserId.length < 1) {
		await knex<SaldoDTO>('saldo').insert({
			user_id: user_id,
			total_balance: topup_amount,
			created_at: new Date()
		})
	} else {
		const findBalanceHistory: IFindBalanceHistory[] = await knex<SaldoHistoryDTO, TopupsDTO>('saldo_history')
			.join('topups', 'topups.topup_id', 'saldo_history.topup_id')
			.select(['topups.user_id', knex.raw('SUM(saldo_history.balance) as total_balance')])
			.where({ user_id: checkSaldoUserId[0].user_id })
			.groupBy(['topups.user_id'])

		const { user_id, total_balance }: IFindBalanceHistory = findBalanceHistory[0]
		await knex<SaldoDTO>('saldo')
			.where({ user_id: user_id })
			.update({ total_balance: total_balance, updated_at: new Date() })
	}

	await knex<LogsDTO>('logs').insert({
		user_id: user_id,
		log_status: 'TOPUP_BALANCE',
		log_time: dateFormat(new Date()),
		created_at: new Date()
	})

	const template: ITopupMail = tempMailTopup(findUser[0].email, topup_method, topup_amount)
	const sgResponse: [ClientResponse, any] = await sgMail.send(template)

	if (!sgResponse) {
		return res.status(500).json({
			status: res.statusCode,
			method: req.method,
			message: 'Server error, failed to sending email confirmation topup'
		})
	}

	return res.status(201).json({
		status: res.statusCode,
		method: req.method,
		message: 'top up balance successfully'
	})
}
