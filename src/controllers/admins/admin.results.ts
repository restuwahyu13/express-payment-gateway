import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { UsersDTO } from '../../dto/dto.users'

export const resultsAdmin = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const findUsers: UsersDTO[] = await knex<UsersDTO>('users').select('*')

	if (findUsers.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'data is not exist'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already exist',
		data: findUsers
	})
}
