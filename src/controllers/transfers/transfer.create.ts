import { Request, Response } from 'express'
import knex from '../../database'
import { TransferDTO } from '../../dto/dto.transfer'
import { UsersDTO } from '../../dto/dto.users'

export const createTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	const { from_user, to_user } = req.body
	const checkUserId = await knex<UsersDTO>('users')
		.whereIn('noc_transfer', [from_user, to_user])
		.select(['user_id', 'email', 'noc_transfer'])

	console.log(checkUserId)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'Hello Wordl'
	})
}
