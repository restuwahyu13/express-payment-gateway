import { Request, Response } from 'express'
import knex from '../../database'
import { TopupsDTO } from '../../dto/topups'

export const createTransfer = (req: Request, res: Response): Promise<Response<any>> => {
	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'Hello Wordl'
	})
}
