import { Request, Response } from 'express'
import knex from '../../database'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'
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

export const resultTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	const findBalance: IFindTopup[] = await knex<UsersDTO, UsersDTO>('topups')
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

	const mergeFindBalanceHistory = findBalance.map(
		async (val: IFindParamsTopup): Promise<Array<IFindNewTopupHistory>> => {
			const findBalanceHistory: IFindTopupHistory[] = await knex<SaldoHistoryDTO, TopupsDTO>('topups')
				.select(['topup_id', 'user_id', 'topup_no', 'topup_amount', 'topup_method', 'topup_time'])
				.where({ user_id: val.user_id })
				.groupBy(['topup_id', 'user_id', 'topup_no', 'topup_amount', 'topup_method', 'topup_time'])
				.orderBy('user_id', 'asc')

			const newBalanceHistory = findBalanceHistory.map(
				(val: IFindParamsHistoryTopup): IFindNewTopupHistory => ({
					topup_id: val.topup_id,
					kode_topup: val.topup_no,
					nominal_topup: rupiahFormatter(val.topup_amount.toString()),
					metode_pembayaran: val.topup_method,
					tanggal_topup: dateFormat(val.topup_time).format('llll')
				})
			)

			const mergeData: Array<IFindNewTopupHistory> = []
			return mergeData.concat(newBalanceHistory)
		}
	)

	const storeFindBalanceHistory: any[] = []
	for (const i of mergeFindBalanceHistory) {
		storeFindBalanceHistory.push(await i)
	}

	const newBalanceUsers = findBalance.map(
		(val: IFindParamsTopup, i: number): IFindNewTopup => {
			return {
				topup_history: {
					user_id: val.user_id,
					email: val.email,
					kode_transfer: val.noc_transfer,
					total_nominal_topup: rupiahFormatter(val.total_topup_amount.toString()),
					total_topup: storeFindBalanceHistory[i]
				}
			}
		}
	)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: newBalanceUsers[0]
	})
}
