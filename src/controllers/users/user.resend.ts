import { Request, Response } from 'express'

export const resend = (req: Request, res: Response): Response<any> => {
	return res.status(200).json({
		message: 'Hello Wordl'
	})
}
