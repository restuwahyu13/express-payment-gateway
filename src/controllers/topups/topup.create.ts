import { Request, Response } from 'express'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { uniqueOrderNumber } from '../../utils/util.uniqueNumber'
import { tempMailTopup } from '../../templates/template.topup'
import { dateFormat } from '../../utils/util.date'
import { paymentMethodValidator } from '../../utils/util.paymentMethod'
import { TopupsDTO } from '../../dto/dto.topups'
import { SaldoDTO } from '../../dto/dto.saldo'
import { LogsDTO } from '../../dto/dto.logs'
import { UsersDTO } from '../../dto/dto.users'
import { TransferDTO } from '../../dto/dto.transfer'
import { ITopupMail } from '../../interface/i.tempmail'

export const createTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	if (req.body.topup_amount <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'mininum topup balance Rp 50.000'
		})
	}

	if (!paymentMethodValidator(req.body.topup_method)) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'payment method is not support, please try again'
		})
	}

	const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: req.body.user_id })

	if (findUser.length < 1) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, topup balance failed'
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
			message: 'topup balance failed, server is busy'
		})
	}

	const { user_id, topup_amount, topup_method }: TopupsDTO = saveTopup[0]
	const checkSaldoUserId: SaldoDTO[] = await knex<SaldoDTO>('saldo').where({ user_id: user_id }).select(['user_id'])

	if (checkSaldoUserId.length < 1) {
		await knex<SaldoDTO>('saldo').insert({
			user_id: user_id,
			total_balance: topup_amount,
			created_at: new Date()
		})
	} else {
		const findTransferHistory: TransferDTO[][] = await knex<TransferDTO>('transfer')
			.select(['transfer_from', knex.raw('SUM(transfer_amount) as transfer_amount'), 'transfer_time'])
			.where({ transfer_from: checkSaldoUserId[0].user_id })
			.groupBy('transfer_from', 'transfer_time')
			.limit(1)
			.orderBy('transfer_time', 'desc')

		if (findTransferHistory.length < 0) {
			const findBalanceHistory: TopupsDTO[] = await knex<TopupsDTO>('topups')
				.select(['user_id', knex.raw('SUM(topup_amount) as topup_amount')])
				.where({ user_id: checkSaldoUserId[0].user_id })
				.groupBy(['user_id'])

			await knex<SaldoDTO>('saldo')
				.where({ user_id: findBalanceHistory[0].user_id })
				.update({ total_balance: findBalanceHistory[0].topup_amount, updated_at: new Date() })
		} else {
			const findBalanceHistory: TopupsDTO[] = await knex<TopupsDTO>('topups')
				.select(['user_id', knex.raw('SUM(topup_amount) as topup_amount'), 'topup_time'])
				.where({ user_id: checkSaldoUserId[0].user_id })
				.groupBy(['user_id', 'topup_time'])
				.limit(1)
				.orderBy('topup_time', 'desc')

			const findSaldo: SaldoDTO[] = await knex<SaldoDTO>('saldo')
				.select(['user_id', knex.raw(`SUM(total_balance + ${findBalanceHistory[0].topup_amount}) as total_balance`)])
				.where({ user_id: findBalanceHistory[0].user_id })
				.groupBy('user_id')

			await knex<SaldoDTO>('saldo')
				.where({ user_id: findSaldo[0].user_id })
				.update({ total_balance: findSaldo[0].total_balance, updated_at: new Date() })
		}
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
			message: 'Internal server error, failed to sending email notification topup'
		})
	}

	return res.status(201).json({
		status: res.statusCode,
		method: req.method,
		message: `topup balance successfully, please check your email ${findUser[0].email}`
	})
}
