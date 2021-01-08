import { Request, Response } from 'express'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import knex from '../../database'
import { TransferDTO } from '../../dto/dto.transfer'
import { UsersDTO } from '../../dto/dto.users'
import { SaldoDTO } from '../../dto/dto.saldo'
import { LogsDTO } from '../../dto/dto.logs'
import { dateFormat } from '../../utils/util.date'
import { expressValidator } from '../../utils/util.validator'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { tempMailTransfer } from '../../templates/template.transfer'
import { ITransferMail } from '../../interface/i.tempmail'

export const createTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const { transfer_from, transfer_to, transfer_amount }: TransferDTO = req.body

	const checkUserIdFrom: UsersDTO[] = await knex<UsersDTO>('users')
		.where({ noc_transfer: transfer_from })
		.select(['user_id', 'email'])

	const checkUserIdTo: UsersDTO[] = await knex<UsersDTO>('users')
		.where({ noc_transfer: transfer_to })
		.select(['user_id', 'email'])

	if (!checkUserIdFrom[0] || !checkUserIdTo[0]) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, transfer balance failed'
		})
	}

	const saveTransfer: TransferDTO[] = await knex<TransferDTO>('transfer')
		.insert({
			transfer_from: checkUserIdFrom[0].user_id,
			transfer_to: checkUserIdTo[0].user_id,
			transfer_amount: transfer_amount,
			transfer_time: dateFormat(new Date()),
			created_at: new Date()
		})
		.returning('*')

	if (Object.keys(saveTransfer).length < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'transfer balance failed, server is busy'
		})
	}

	const checkSaldoFrom: SaldoDTO[] = await knex<SaldoDTO>('saldo')
		.where({ user_id: checkUserIdFrom[0].user_id })
		.select('total_balance')

	if (checkSaldoFrom[0].total_balance <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: `${checkUserIdFrom[0].email} your balance is insufficient ${rupiahFormatter(
				checkSaldoFrom[0].total_balance.toString()
			)}`
		})
	}

	const findSaldoFrom: SaldoDTO[] = await knex<SaldoDTO>('saldo')
		.where({ user_id: checkUserIdFrom[0].user_id })
		.select(knex.raw(`SUM(total_balance - ${saveTransfer[0].transfer_amount}) as total_balance`))

	const findSaldoTo: SaldoDTO[] = await knex<SaldoDTO>('saldo')
		.where({ user_id: checkUserIdTo[0].user_id })
		.select(knex.raw(`SUM(total_balance + ${saveTransfer[0].transfer_amount}) as total_balance`))

	if (!findSaldoFrom[0] || !findSaldoTo[0]) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'saldo id is not exist, transfer balance failed'
		})
	}

	const updateSaldoUserFrom: number = await knex<SaldoDTO>('saldo')
		.where({ user_id: checkUserIdFrom[0].user_id })
		.update({ total_balance: findSaldoFrom[0].total_balance, updated_at: new Date() })

	const updateSaldoUserTo: number = await knex<SaldoDTO>('saldo')
		.where({ user_id: checkUserIdTo[0].user_id })
		.update({ total_balance: findSaldoTo[0].total_balance, updated_at: new Date() })

	if (updateSaldoUserFrom < 1 || updateSaldoUserTo < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'transfer balance failed, server is busy'
		})
	}

	await knex<LogsDTO>('logs').insert({
		user_id: checkUserIdFrom[0].user_id,
		log_status: 'TRANSFER_SALDO',
		log_time: dateFormat(new Date()),
		created_at: new Date()
	})

	const template: ITransferMail = tempMailTransfer(
		checkUserIdFrom[0].email,
		checkUserIdTo[0].email,
		saveTransfer[0].transfer_amount
	)
	const sgResponse: [ClientResponse, any] = await sgMail.send(template)

	if (!sgResponse) {
		return res.status(500).json({
			status: res.statusCode,
			method: req.method,
			message: 'Internal server error, failed to sending email notification transfer'
		})
	}

	return res.status(201).json({
		status: res.statusCode,
		method: req.method,
		message: `transfer balance successfully, please check your email ${checkUserIdFrom[0].email}`
	})
}
