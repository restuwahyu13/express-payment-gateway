import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { UsersDTO } from '../../dto/dto.users'

export const resultAdmin = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: req.params.id }).select('*')

	if (findUser.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already exist',
		data: findUser
	})
}
