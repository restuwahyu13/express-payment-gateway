import { Request, Response } from 'express'
import knex from '../../database'
import { TransferDTO } from '../../dto/dto.transfer'
import { UsersDTO } from '../../dto/dto.users'
import { SaldoDTO } from '../../dto/dto.saldo'
import { dateFormat } from '../../utils/util.date'
import { rupiahFormatter } from '../../utils/util.rupiah'

export const createTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	const { transfer_from, transfer_to, transfer_amount }: TransferDTO = req.body

	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users')
		.whereIn('noc_transfer', [transfer_from, transfer_to])
		.select(['user_id', 'email', 'noc_transfer'])

	if (checkUserId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, transfer balance failed'
		})
	}

	const saveTransfer: TransferDTO[] = await knex<TransferDTO>('transfer').insert({
		transfer_from: checkUserId[0],
		transfer_to: checkUserId[1],
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
		.where({ user_id: checkUserId[0] })
		.select(['total_balance'])

	if (findSaldo[0].total_balance <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'sisa saldo anda tidak cukup' + rupiahFormatter(findSaldo[0].total_balance.toString())
		})
	}

	const trimSaldo: number = findSaldo[0].total_balance - transfer_amount
	const updateLastSaldo: number = await knex<SaldoDTO>('saldo')
		.where({ user_id: checkUserId[0] })
		.update({ total_balance: trimSaldo })

	if (updateLastSaldo < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'transfer balance failed, server is busy'
		})
	}

	// const template: ITopupMail = tempMailTopup(findUser[0].email, topup_method, topup_amount)
	// const sgResponse: [ClientResponse, any] = await sgMail.send(template)

	// if (!sgResponse) {
	// 	return res.status(500).json({
	// 		status: res.statusCode,
	// 		method: req.method,
	// 		message: 'Internal server error, failed to sending email confirmation transfer'
	// 	})
	// }

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'transfer balance successfully'
	})
}
