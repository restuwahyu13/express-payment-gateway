import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { TransferDTO } from '../../dto/dto.transfer'
import { UsersDTO } from '../../dto/dto.users'

export const deleteTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const checkTransferId: UsersDTO[] = await knex<UsersDTO>('transfer').where({ transfer_id: req.params.id }).select('*')

	if (checkTransferId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'transfer id is not exist, delete data transfer failed'
		})
	}

	const deleteTransfer: number = await knex<TransferDTO>('transfer').where({ transfer_id: req.params.id }).delete()

	if (deleteTransfer < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'delete data transfer failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'delete data transfer successfully'
	})
}
