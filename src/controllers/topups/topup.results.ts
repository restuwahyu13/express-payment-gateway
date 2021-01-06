import { Request, Response } from 'express'
import knex from '../../database'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'
import { SaldoDTO } from '../../dto/dto.saldo'
import { SaldoHistoryDTO } from '../../dto/dto.saldoHistory'
import { dateFormat } from '../../utils/util.date'
import { rupiahFormatter } from '../../utils/util.rupiah'
import {
	IFindTopup,
	IFindNewTopup,
	IFindParamsTopup,
	IFindTopupHistory,
	IFindNewTopupHistory,
	IFindParamsHistoryTopup
} from '../../interface/i.topup'

export const resultsTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	const findTopupAmount: IFindTopup[] = await knex<SaldoDTO, UsersDTO>('topups')
		.join('users', 'users.user_id', 'topups.user_id')
		.select([
			'topups.user_id',
			'users.email',
			'users.noc_transfer',
			knex.raw('SUM (topups.topup_amount) as total_topup_amount')
		])
		.groupBy(['topups.user_id', 'users.email', 'users.noc_transfer'])
		.orderBy('topups.user_id', 'asc')

	if (findTopupAmount.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'data is not exist'
		})
	}

	const findMergeTopupAmount = findTopupAmount.map(
		async (val: IFindParamsTopup): Promise<Array<IFindNewTopupHistory>> => {
			const findTopupAmountHistory: IFindTopupHistory[] = await knex<SaldoHistoryDTO, TopupsDTO>('topups')
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
		async (val: IFindParamsTopup, i: number): Promise<IFindNewTopup> => ({
			topup_history: {
				user_id: val.user_id,
				email: val.email,
				kode_transfer: val.noc_transfer,
				total_nominal_topup: rupiahFormatter(val.total_topup_amount.toString()),
				total_topup: await findMergeTopupAmount[i]
			}
		})
	)

	const findStoreTopupAmountHistory: any[] = []
	for (const i of findNewTopupAmountUser) {
		findStoreTopupAmountHistory.push(await i)
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: findStoreTopupAmountHistory
	})
}
