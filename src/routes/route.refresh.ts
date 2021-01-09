import express, { Router, Request, Response } from 'express'
import { signRefreshToken } from '../utils/util.jwt'

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

router.get(
	'/',
	(req: Request, res: Response): Response<any> => res.send('<h1>Welcome To Express Fake Payment Gateway</h1>')
)

export default router
