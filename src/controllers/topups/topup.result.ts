import { Request, Response } from 'express'
import knex from '../../database'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'
import { dateFormat } from '../../utils/util.date'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { expressValidator } from '../../utils/util.validator'
import {
	IFindTopup,
	IFindNewTopup,
	IFindParamsTopup,
	IFindTopupHistory,
	IFindNewTopupHistory,
	IFindParamsHistoryTopup
} from '../../interface/i.topup'

export const resultTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const findTopupAmount: IFindTopup[] = await knex<UsersDTO, UsersDTO>('topups')
		.join('users', 'users.user_id', 'topups.user_id')
		.select([
			'topups.user_id',
			'users.email',
			'users.noc_transfer',
			knex.raw('SUM (topups.topup_amount) as total_topup_amount')
		])
		.where({ 'topups.user_id': req.params.id })
		.groupBy(['topups.user_id', 'users.email', 'users.noc_transfer'])
		.orderBy('topups.user_id', 'asc')

	const findUser: UsersDTO[] = await knex<UsersDTO>('users').select('email').where({ user_id: req.params.id })

	if (findTopupAmount.length < 1 && findUser.length > 0) {
		return res.status(200).json({
			status: res.statusCode,
			method: req.method,
			message: `${findUser[0].email} you never topup money`
		})
	}

	const findMergeTopupAmount = findTopupAmount.map(
		async (val: IFindParamsTopup): Promise<Array<IFindNewTopupHistory>> => {
			const findTopupAmountHistory: IFindTopupHistory[] = await knex<TopupsDTO>('topups')
				.select(['topup_id', 'user_id', 'topup_no', 'topup_amount', 'topup_method', 'topup_time'])
				.where({ user_id: val.user_id })
				.groupBy(['topup_id', 'user_id', 'topup_no', 'topup_amount', 'topup_method', 'topup_time'])
				.orderBy('topup_time', 'desc')

			const findNewTopupAmountHistory = findTopupAmountHistory.map(
				(val: IFindParamsHistoryTopup): IFindNewTopupHistory => ({
					topup_id: val.topup_id,
					kode_topup: val.topup_no,
					nominal_topup: rupiahFormatter(val.topup_amount.toString()),
					metode_pembayaran: val.topup_method,
					tanggal_topup: dateFormat(val.topup_time).format('llll')
				})
			)

			return findNewTopupAmountHistory
		}
	)

	const findNewTopupAmountUser = findTopupAmount.map(
		async (val: IFindParamsTopup): Promise<IFindNewTopup> => {
			return {
				topup_history: {
					user_id: val.user_id,
					email: val.email,
					kode_transfer: val.noc_transfer,
					total_nominal_topup: rupiahFormatter(val.total_topup_amount.toString()),
					total_topup: await findMergeTopupAmount[0]
				}
			}
		}
	)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: await findNewTopupAmountUser[0]
	})
}
