import { Request, Response } from 'express'
import knex from '../../database'
import { UsersDTO } from '../../dto/users'
import { LogsDTO } from '../../dto/logs'
import { encodedJwt } from '../../utils/util.jwt'
import { verifyPassword } from '../../utils/util.encrypt'

export const login = async (req: Request, res: Response): Promise<Response<any>> => {
	const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ email: req.body.email }).select()

	if (findUser.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user account is not exitst, please register'
		})
	}

	if (findUser[0].active == false) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			message: 'user account is not active, please resend new activation token'
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
					message: `Internal Server Error ${err}`
				})
			}

			if (!success) {
				return res.status(400).json({
					status: res.statusCode,
					method: req.method,
					message: 'username/password is wrong'
				})
			}

			await knex<LogsDTO>('logs').insert({ user_id: user_id, status: 'STATUS_LOGIN', created_at: new Date() })
			const updateFirstLogin: number = await knex<UsersDTO>('users')
				.where({ email })
				.update({ first_login: new Date() })

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
