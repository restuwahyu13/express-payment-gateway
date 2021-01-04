import { Request, Response } from 'express'
import knex from '../../database'
import { UsersDTO } from '../../dto/dto.users'
import { verifySignAccessToken } from '../../utils/util.jwt'

export const activation = async (req: Request, res: Response): Promise<Response<any>> => {
	try {
		const { email }: UsersDTO = verifySignAccessToken()(req, res, req.params.token)
		const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ email: email }).select('active')

		if (findUser[0].active === true) {
			return res.status(200).json({
				status: res.statusCode,
				method: req.method,
				message: 'user account hash been active, please login'
			})
		}

		const updateActive: number = await knex<UsersDTO>('users').where({ email }).update({ active: true })
		if (updateActive < 1) {
			return res.status(400).json({
				status: res.statusCode,
				method: req.method,
				message: 'activation account failed, please try again'
			})
		}

		return res.status(200).json({
			status: res.statusCode,
			method: req.method,
			message: 'activation account successfuly, please login'
		})
	} catch (err) {
		return res.status(401).json({
			status: res.statusCode,
			method: req.method,
			message: 'access token expired, please resend new activation token'
		})
	}
}
