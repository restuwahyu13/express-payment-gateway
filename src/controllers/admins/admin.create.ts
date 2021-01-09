import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { uniqueOrderNumber } from '../../utils/util.uniqueNumber'
import { hashPassword } from '../../utils/util.encrypt'
import { UsersDTO } from '../../dto/dto.users'

export const createAdmin = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const { email, password, active, role }: UsersDTO = req.body
	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users').where({ email: email }).select('*')

	if (checkUserId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, add new users data failed'
		})
	}

	const saveAdmin: UsersDTO[] = await knex<UsersDTO>('users')
		.insert({
			email: email,
			noc_transfer: uniqueOrderNumber(),
			password: hashPassword(password),
			active: active,
			role: role,
			created_at: new Date()
		})
		.returning('*')

	if (Object.keys(saveAdmin[0]).length < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'add new users data failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'add new users data successfully'
	})
}
