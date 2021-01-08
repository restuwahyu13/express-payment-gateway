import { Request, Response, NextFunction } from 'express'
import { verifySignAccessToken } from '../utils/util.jwt'
import { message } from '../utils/util.message'

export const authJwt = () => (req: Request | any, res: Response, next: NextFunction): void => {
	const tokenHeader: string = req.headers.authorization
	if (tokenHeader) {
		try {
			const decodedToken: string | any = verifySignAccessToken()(req, res, tokenHeader.split('Bearer ')[1])
			req.user = decodedToken
			next()
		} catch (err) {
			message({
				response: res,
				statusCode: 401,
				method: req.method,
				message: 'unautorization, access token expired'
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
