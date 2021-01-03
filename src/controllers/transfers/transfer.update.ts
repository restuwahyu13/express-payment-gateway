import { Request, Response } from 'express'
import knex from '../../database'
import { TransferDTO } from '../../dto/dto.transfer'

export const updateTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'Hello Wordl'
	})
}
