import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { uniqueOrderNumber } from '../../utils/util.uniqueNumber'
import { UsersDTO } from '../../dto/dto.users'

export const updateAdmin = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const { email, password, active, role }: UsersDTO = req.body
	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users').where({ user_id: req.params.id }).select('*')

	if (checkUserId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, update users data failed'
		})
	}

	const updateAdmin: number = await knex<UsersDTO>('users').where({ user_id: checkUserId[0].user_id }).update({
		email: email,
		noc_transfer: uniqueOrderNumber(),
		password: password,
		active: active,
		role: role,
		updated_at: new Date()
	})

	if (updateAdmin < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'update user data failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'update user data successfully'
	})
}
