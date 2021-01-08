import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { TransferDTO } from '../../dto/dto.transfer'
import { UsersDTO } from '../../dto/dto.users'

export const updateTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}
	const { transfer_from, transfer_to, transfer_amount }: TransferDTO = req.body

	if (transfer_amount <= 49000) {
		return res.status(403).json({
			status: res.statusCode,
			method: req.method,
			message: 'mininum transfer balance Rp 50.000'
		})
	}

	const CheckUserId: UsersDTO[] = await knex<UsersDTO>('users')
		.andWhere({ transfer_from: transfer_from, transfer_to: transfer_to })
		.select('*')

	if (CheckUserId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, update data transfer failed'
		})
	}

	const updateTransfer: number = await knex<TransferDTO>('transfer').where({ transfer_id: req.params.id }).update({
		transfer_from: transfer_from,
		transfer_to: transfer_to,
		transfer_amount: transfer_amount,
		update_at: new Date()
	})

	if (updateTransfer < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'update data transfer failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'update data transfer successfully'
	})
}
