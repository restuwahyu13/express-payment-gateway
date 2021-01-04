import { Request, Response } from 'express'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import knex from '../../database'
import { TransferDTO } from '../../dto/dto.transfer'
import { UsersDTO } from '../../dto/dto.users'
import { SaldoDTO } from '../../dto/dto.saldo'
import { dateFormat } from '../../utils/util.date'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { tempMailTransfer } from '../../templates/template.transfer'
import { ITransferMail } from '../../interface/i.tempmail'

export const createTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	const { transfer_from, transfer_to, transfer_amount }: TransferDTO = req.body

	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users')
		.whereIn('noc_transfer', [transfer_from, transfer_to])
		.select(['user_id', 'email'])

	if (checkUserId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, transfer balance failed'
		})
	}

	const saveTransfer: TransferDTO[] = await knex<TransferDTO>('transfer').insert({
		transfer_from: checkUserId[0].user_id,
		transfer_to: checkUserId[1].user_id,
		transfer_amount: transfer_amount,
		transfer_time: dateFormat(new Date()),
		created_at: new Date()
	})

	if (Object.keys(saveTransfer).length < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'transfer balance failed, server is busy'
		})
	}

	const findSaldo: SaldoDTO[] = await knex<SaldoDTO>('saldo')
		.where({ user_id: checkUserId[0].user_id })
		.select(['total_balance'])

	if (findSaldo[0].total_balance <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'your balance is not enough' + rupiahFormatter(findSaldo[0].total_balance.toString())
		})
	}

	const trimSaldo: number = findSaldo[0].total_balance - transfer_amount
	const updateLastSaldo: number = await knex<SaldoDTO>('saldo')
		.where({ user_id: checkUserId[0].user_id })
		.update({ total_balance: +trimSaldo, updated_at: new Date() })

	if (updateLastSaldo < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'transfer balance failed, server is busy'
		})
	}

	const template: ITransferMail = tempMailTransfer(checkUserId[0].email, checkUserId[1].email, transfer_amount)
	const sgResponse: [ClientResponse, any] = await sgMail.send(template)

	if (!sgResponse) {
		return res.status(500).json({
			status: res.statusCode,
			method: req.method,
			message: 'Internal server error, failed to sending email confirmation transfer'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'transfer balance successfully'
	})
}
