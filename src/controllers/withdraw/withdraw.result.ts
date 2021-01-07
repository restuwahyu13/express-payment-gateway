import { Request, Response } from 'express'

export const resultWithdraw = async (req: Request, res: Response): Promise<Response<any>> => {
	return res.status(200).json({ message: 'hello wordl' })
}
