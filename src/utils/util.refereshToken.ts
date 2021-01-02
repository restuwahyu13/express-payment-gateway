import { Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { Base64 } from 'js-base64'
import { UsersDTO } from './../dto/users'
import { message } from '../utils/util.message'

const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET

export const signAccessToken = (req: Request, res: Response, payload: UsersDTO): string | any => {
	try {
		if (payload) {
			const accessToken: string = jwt.sign({ ...payload }, ACCESS_TOKEN_SECRET, { expiresIn: '1m' })
			const refreshToken: string = jwt.sign({ ...payload }, REFRESH_TOKEN_SECRET, { expiresIn: '90d' })

			const encodedAccessToken: string = Base64.encode(accessToken)
			const encodedRefreshToken: string = Base64.encode(refreshToken)

			res.cookie('refreshToken', `${encodedRefreshToken}`, { maxAge: 86400 * 90, httpOnly: true })

			return { accessToken: encodedAccessToken, refreshToken: encodedRefreshToken }
		}
	} catch (err) {
		message({
			response: res,
			statusCode: 500,
			method: req.method,
			message: 'Internal Server Error'
		})
	}
}

export const signRefreshToken = () => (req: Request, res: Response): string | any => {
	try {
		const getToken: string = req.cookies['refreshToken']

		if (Base64.isValid(getToken) && getToken) {
			const decodedToken: string = Base64.decode(getToken)

			const { user_id, email }: string | any = jwt.verify(decodedToken, REFRESH_TOKEN_SECRET)
			const accessToken: string = jwt.sign({ user_id: user_id, email: email }, ACCESS_TOKEN_SECRET, {
				expiresIn: '90d'
			})

			const encodedAccessToken: string = Base64.encode(accessToken)
			return encodedAccessToken
		}
	} catch (err) {
		message({
			response: res,
			statusCode: 500,
			method: req.method,
			message: 'Internal Server Error'
		})
	}
}
