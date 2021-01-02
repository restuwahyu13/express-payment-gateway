import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Base64 } from 'js-base64'
import { message } from '../utils/util.message'

export const authJwt = () => (req: Request, res: Response, next: NextFunction): void | Response<any> => {
	const tokenHeader: string = req.headers.authorization.split('Bearer ')[1]
	if (tokenHeader) {
		try {
			const decodedToken: string = Base64.decode(tokenHeader)
			const { user_id, email }: string | any = jwt.verify(decodedToken, process.env.ACCESS_TOKEN_SECRET)
			req['user'] = { user_id: user_id, email: email }
			next()
		} catch (err) {
			message({
				response: res,
				statusCode: 401,
				method: req.method,
				message: 'unautorization, access token is expired'
			})
		}
	} else {
		message({
			response: res,
			statusCode: 401,
			method: req.method,
			message: 'unautorization, access token is required'
		})
	}
}
