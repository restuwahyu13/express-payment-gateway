import { Request, Response } from 'express'
import knex from '../../database'
import { TransferDTO } from '../../dto/transfer'

export const createTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'Hello Wordl'
	})
}
