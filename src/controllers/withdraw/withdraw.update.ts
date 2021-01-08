import { Request, Response } from 'express'
import { expressValidator } from '../../utils/util.validator'

export const updateWithdraw = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	return res.status(200).json({ message: 'hello wordl' })
}
