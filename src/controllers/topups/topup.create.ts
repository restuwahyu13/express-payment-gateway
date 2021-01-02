import { Request, Response } from 'express'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import knex from '../../database'
import { TopupsDTO } from '../../dto/topups'
import { SaldoDTO } from '../../dto/saldo'
import { LogsDTO } from '../../dto/logs'
import { uuid } from '../../utils/util.uuid'
import { UsersDTO } from './../../dto/users'
import { tempMailTopup } from '../../templates/template.topup'
import { dateFormat } from '../../utils/util.date'

export const createTopup = (req: Request, res: Response): Promise<Response<any>> => {
	interface ITopupMail {
		from: string
		to: string
		subject: string
		html: string
	}

	interface IBody {
		user_id: number
		topup_amount: number
		topup_time: Date
	}

	const { user_id, topup_amount, topup_time }: IBody = req.body
	const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id })

	if (findUser.length < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'top up balance failed, user_id is not exist in the system'
		})
	}

	const saveTopup: TopupsDTO[] = await knex<TopupsDTO>('topups')
		.insert({
			user_id: findUser[0].user_id,
			topup_no: uuid(),
			topup_amount,
			topup_time,
			created_at: new Date()
		})
		.returning(['topup_id', 'amount'])

	const { topup_id, user_id, amount }: TopupsDTO = saveTopup[0]
	await knex<SaldoDTO>('saldo').insert({ topup_id, amount })
	await knex<LogsDTO>('logs').insert({
		user_id,
		logs_status: 'TOPUP_BALANCE',
		logs_time: dateFormat(new Date()).format(),
		created_at: new Date()
	})

	if (saveTopup.length < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'top up balance failed, server is busy'
		})
	}

	const template: ITopupMail = tempMailTopup(findUser[0].email, amount)
	const sgResponse: [ClientResponse, any] = await sgMail.send(template)

	if (!sgResponse) {
		return res.status(500).json({
			status: res.statusCode,
			method: req.method,
			message: 'Server error failed to sending email activation'
		})
	}

	return res.status(201).json({
		status: res.statusCode,
		method: req.method,
		message: 'top up balance successfuly'
	})
}
