import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { UsersDTO } from '../../dto/dto.users'

export const deleteAdmin = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: req.params.id }).select('*')

	if (checkUserId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, delete users data failed'
		})
	}

	const deleteUserId: number = await knex<UsersDTO>('users').where({ user_id: checkUserId[0].user_id }).delete()

	if (deleteUserId < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'delete user data failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'delete user data successfully'
	})
}
