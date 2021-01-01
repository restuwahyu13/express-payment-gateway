import { Request, Response } from 'express'
import knex from '../../database'
import { UsersDTO } from '../../dto/users'
import { decodedJwt } from '../../utils/util.jwt'
import { verifyPassword } from '../../utils/util.encrypt'

export const reset = async (req: Request, res: Response): Promise<Response<any>> => {
	try {
		interface IEmail {
			email: string
		}

		const { email }: IEmail = decodedJwt(req.params.token)
		const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ email: email }).select('password')

		if (findUser.length < 1) {
			return res.status(404).json({
				status: res.statusCode,
				method: req.method,
				message: 'user account is not exist, please register'
			})
		}

		const { password } = req.body
		const hashPassword = findUser[0].password

		verifyPassword(
			password,
			hashPassword,
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
						message: 'old username/password is wrong'
					})
				}

				return res.status(200).json({
					status: res.statusCode,
					method: req.method,
					message: 'change password successfuly, please login'
				})
			}
		)
	} catch (err) {
		return res.status(401).json({
			status: res.statusCode,
			method: req.method,
			message: 'access token expired, please try again'
		})
	}
}
