import { Request, Response } from 'express'
import knex from '../../database'
import { UsersDTO } from '../../dto/dto.users'
import { verifySignAccessToken } from '../../utils/util.jwt'
import { expressValidator } from '../../utils/util.validator'
import { hashPassword as encodePassword } from '../../utils/util.encrypt'

export const reset = async (req: Request, res: Response): Promise<Response<any>> => {
	try {
		const errors = expressValidator(req)

		if (errors.length > 0) {
			return res.status(400).json({
				status: res.statusCode,
				method: req.method,
				errors
			})
		}

		const { email }: UsersDTO = verifySignAccessToken()(req, res, req.params.token)
		const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ email: email }).select('password')

		if (findUser.length < 1) {
			return res.status(404).json({
				status: res.statusCode,
				method: req.method,
				message: 'user account is not exist, please register'
			})
		}

		const hashPassword: string = encodePassword(req.body.password)
		const updatePassword: number = await knex<UsersDTO>('users')
			.where({ email: email })
			.update({ password: hashPassword })

		if (updatePassword < 1) {
			return res.status(200).json({
				status: res.statusCode,
				method: req.method,
				message: 'update password failed, please try again'
			})
		}

		return res.status(200).json({
			status: res.statusCode,
			method: req.method,
			message: 'update password successfully, please login'
		})
	} catch (err) {
		return res.status(401).json({
			status: res.statusCode,
			method: req.method,
			message: 'access token expired, please try forgot password again'
		})
	}
}
