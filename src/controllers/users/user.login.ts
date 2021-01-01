import { Request, Response } from 'express'
import knex from '../../database'
import { UsersDTO } from '../../dto/users'
import { encodedJwt } from '../../utils/util.jwt'
import { verifyPassword } from '../../utils/util.encrypt'

export const login = async (req: Request, res: Response): Promise<Response<any>> => {
	const findUser = await knex<UsersDTO>('users').where({ email: req.body }).select('email')

	if (findUser.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user account is not exitst, please register now'
		})
	}

	const { user_id, email, password }: UsersDTO = findUser[0]
	const token: string = encodedJwt({ user_id, email }, { expiresIn: '1d' })
	verifyPassword(
		req.body.password,
		password,
		async (err: any, success: boolean): Promise<Response<any>> => {
			if (err) {
				return res.status(500).json({
					status: res.statusCode,
					method: req.method,
					message: 'Internal Server Error'
				})
			}

			if (!success) {
				return res.status(400).json({
					status: res.statusCode,
					method: req.method,
					message: 'username/password is wrong'
				})
			}

			const updateFirstLogin = await knex<UsersDTO>('users').where({ email }).update({ first_login: new Date() })
			if (updateFirstLogin > 0) {
				return res.status(200).json({
					status: res.statusCode,
					method: req.method,
					message: 'Login successfuly',
					access_token: token
				})
			}
		}
	)
}
