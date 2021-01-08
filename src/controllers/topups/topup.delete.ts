import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { TopupsDTO } from '../../dto/dto.topups'

export const deleteTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const checkTopupId: TopupsDTO[] = await knex<TopupsDTO>('topups').where({ topup_id: req.params.id }).select('*')

	if (checkTopupId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'topup id is not exist, delete data topup failed'
		})
	}

	const deleteTopup: number = await knex<TopupsDTO>('topups').where({ topup_id: checkTopupId[0].topup_id }).delete()

	if (deleteTopup < 1) {
		return res.status(408).json({
			status: res.statusCode,
			method: req.method,
			message: 'delete data topup failed, server is busy'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'delete data topup successfully'
	})
}
