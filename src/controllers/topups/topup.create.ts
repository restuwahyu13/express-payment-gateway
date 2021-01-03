import { Request, Response } from 'express'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import knex from '../../database'
import { TopupsDTO } from '../../dto/dto.topups'
import { SaldoDTO } from '../../dto/dto.saldo'
import { LogsDTO } from '../../dto/dto.logs'
import { uniqueOrderNumber } from '../../utils/util.uuid'
import { UsersDTO } from '../../dto/dto.users'
import { tempMailTopup } from '../../templates/template.topup'
import { dateFormat } from '../../utils/util.date'
import { ITopupMail } from '../../interface/i.tempmail'

export const createTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	if (req.body.topup_amount <= 49000) {
		return res.status(400).json({
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
			message: 'top up balance failed, user id is not exist in the system'
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

	// const checkUserIdIdExist: SaldoDTO[] = await knex<SaldoDTO>('saldo')
	// 	.where({ user_id: findUser[0].user_id })
	// 	.select('topup_id')

	// if (checkUserIdIdExist.length < 1) {
	const { topup_id, user_id, topup_amount, topup_method }: TopupsDTO = saveTopup[0]
	await knex<SaldoDTO>('saldo').insert({ topup_id: topup_id, balance: topup_amount, created_at: new Date() })
	// } else {
	// 	const { topup_id }: SaldoDTO = checkUserIdIdExist[0]
	// 	const findBalance: SaldoDTO[] = await knex<SaldoDTO>('saldo')
	// 		.where({ topup_id: topup_id })
	// 		.select(['saldo_id', 'balance'])

	// 	const { saldo_id, balance }: SaldoDTO = findBalance[0]
	// 	const addBalance = balance + saveTopup[0].topup_amount
	// 	await knex('saldo').where({ saldo_id: saldo_id }).update({ balance: addBalance, updated_at: new Date() })
	// }

	await knex<LogsDTO>('logs').insert({
		user_id: user_id,
		logs_status: 'TOPUP_BALANCE',
		logs_time: dateFormat(new Date()),
		created_at: new Date()
	})

	const template: ITopupMail = tempMailTopup(findUser[0].email, topup_method, topup_amount)
	const sgResponse: [ClientResponse, any] = await sgMail.send(template)

	if (!sgResponse) {
		return res.status(500).json({
			status: res.statusCode,
			method: req.method,
			message: 'Server error failed to sending email confirmation topup'
		})
	}

	return res.status(201).json({
		status: res.statusCode,
		method: req.method,
		message: 'top up balance successfuly'
	})
}
