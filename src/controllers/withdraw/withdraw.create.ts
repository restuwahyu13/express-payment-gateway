import { Request, Response } from 'express'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import knex from '../../database'
import { WithdrawDTO } from './../../dto/dto.withdraw'
import { SaldoDTO } from './../../dto/dto.saldo'
import { LogsDTO } from './../../dto/dto.logs'
import { UsersDTO } from './../../dto/dto.users'
import { dateFormat } from './../../utils/util.date'
import { rupiahFormatter } from './../../utils/util.rupiah'
import { expressValidator } from '../../utils/util.validator'
import { tempMailWithdraw } from './../../templates/template.withdraw'
import { IWithdrawMail } from '../../interface/i.tempmail'

export const createWithdraw = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	if (req.body.withdraw_amount <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'mininum withdraw balance Rp 50.000'
		})
	}

	const findUser: UsersDTO[] = await knex<UsersDTO>('users')
		.where({ user_id: req.body.user_id })
		.select(['user_id', 'email'])

	if (findUser.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, withdraw failed'
		})
	}

	const checkSaldo: SaldoDTO[] = await knex<SaldoDTO>('saldo')
		.where({ user_id: findUser[0].user_id })
		.select('total_balance')

	if (checkSaldo[0].total_balance <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: `${findUser[0].email} your balance is insufficient ${rupiahFormatter(
				checkSaldo[0].total_balance.toString()
			)}`
		})
	}

	const saveWithdraw: WithdrawDTO[] = await knex<WithdrawDTO>('withdraw')
		.insert({
			user_id: findUser[0].user_id,
			withdraw_amount: req.body.withdraw_amount,
			withdraw_time: dateFormat(new Date()),
			created_at: new Date()
		})
		.returning('*')

	if (Object.keys(saveWithdraw[0]).length < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'withdraw failed, server is busy'
		})
	}

	const getLastWithdrawAmount: WithdrawDTO[] = await knex<WithdrawDTO>('withdraw')
		.where({ user_id: saveWithdraw[0].user_id })
		.select(['withdraw_amount', 'withdraw_time'])
		.groupBy(['withdraw_amount', 'withdraw_time'])
		.limit(1)
		.orderBy('withdraw_time', 'desc')

	const subtractBalance: SaldoDTO[] = await knex<SaldoDTO>('saldo')
		.where({ user_id: saveWithdraw[0].user_id })
		.select(knex.raw(`SUM(total_balance - ${getLastWithdrawAmount[0].withdraw_amount}) as total_balance`))

	await knex<SaldoDTO>('saldo')
		.where({ user_id: saveWithdraw[0].user_id })
		.update({ total_balance: subtractBalance[0].total_balance, updated_at: new Date() })

	await knex<LogsDTO>('logs').insert({
		user_id: saveWithdraw[0].user_id,
		log_status: 'WITHDRAW_BALANCE',
		log_time: dateFormat(new Date()),
		created_at: new Date()
	})

	const template: IWithdrawMail = tempMailWithdraw(
		findUser[0].email,
		getLastWithdrawAmount[0].withdraw_amount,
		subtractBalance[0].total_balance
	)

	const sgResponse: [ClientResponse, any] = await sgMail.send(template)

	if (!sgResponse) {
		return res.status(500).json({
			status: res.statusCode,
			method: req.method,
			message: 'Internal server error, failed to sending email notification withdraw'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: `withdraw successfully, please check your email ${findUser[0].email}`
	})
}
