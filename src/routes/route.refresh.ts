import express, { Router, Request, Response } from 'express'
import { authJwt } from '../middlewares/middleware.auth'
import { signAccessToken, signRefreshToken } from '../utils/util.jwt'

const router: Router = express.Router()

router.post('/refresh-token', (req: Request, res: Response) => {
	const refreshToken: string = signRefreshToken()(req, res)
	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'new accessToken',
		newAccessToken: refreshToken
	})
})

router.get('/test/protect', authJwt(), (req: Request, res: Response) => {
	res.status(200).json({ data: req['user'], message: 'aim in proteced route' })
})

router.post('/test/login', (req: Request, res: Response) => {
	interface IBody {
		user_id: number
		email: string
	}
	const bodyPayload: IBody = { user_id: Date.now(), email: req.body.email }
	const token: any = signAccessToken(req, res, bodyPayload)
	return res.status(200).json(token)
})

export default router
