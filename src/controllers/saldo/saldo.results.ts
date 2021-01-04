import { Request, Response } from 'express'
import knex from '../../database'
import { SaldoDTO } from '../../dto/dto.saldo'
import { SaldoHistoryDTO } from '../../dto/dto.saldoHistory'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { dateFormat } from '../../utils/util.date'
import {
	IFindBalance,
	IFindBalanceHistory,
	INewFindBalance,
	INewFindBalanceHistory,
	IParamsFindBalance,
	IParamsFindBalanceHistory
} from '../../interface/i.saldo'

export const resultsSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const findBalance: IFindBalance[] = await knex<SaldoDTO, UsersDTO>('saldo')
		.join('users', 'users.user_id', 'saldo.user_id')
		.select([
			'users.user_id as saldo_user_id',
			'users.email',
			'users.noc_transfer',
			'saldo.total_balance',
			'saldo.withdraw_amount',
			'saldo.withdraw_time',
			'saldo.created_at as saldo_created'
		])
		.orderBy('saldo_user_id', 'asc')

	const mergeFindBalanceHistory = findBalance.map(
		async (val: IParamsFindBalance): Promise<Array<INewFindBalanceHistory>> => {
			const findBalanceHistory: IFindBalanceHistory[] = await knex<SaldoHistoryDTO, TopupsDTO>('saldo_history')
				.join('topups', 'topups.topup_id', 'saldo_history.topup_id')
				.select(['topups.user_id', 'topups.topup_method', 'saldo_history.balance', 'saldo_history.created_at'])
				.where({ 'topups.user_id': val.saldo_user_id })
				.groupBy(['topups.user_id', 'topups.topup_method', 'saldo_history.balance', 'saldo_history.created_at'])
				.orderBy('created_at', 'desc')

			const newBalanceHistory = findBalanceHistory.map(
				(val: IParamsFindBalanceHistory): INewFindBalanceHistory => ({
					user_id: val.user_id,
					saldoTopup: rupiahFormatter(val.balance.toString()),
					metodePembayaran: val.topup_method,
					tanggalTopup: dateFormat(val.created_at).format('llll')
				})
			)

			const mergeData: Array<INewFindBalanceHistory> = []
			return mergeData.concat(newBalanceHistory)
		}
	)

	const storeFindBalanceHistory: any[] = []
	for (const i of mergeFindBalanceHistory) {
		storeFindBalanceHistory.push(await i)
	}

	const newBalanceUsers = findBalance.map(
		(val: IParamsFindBalance, i: number): INewFindBalance => {
			return {
				reportSaldoUser: {
					user_id: val.saldo_user_id,
					email: val.email,
					kodeTransfer: val.noc_transfer,
					jumlahUang: rupiahFormatter(val.total_balance.toString()),
					jumlahPenarikan: rupiahFormatter(val.withdraw_amount.toString()),
					waktuPenarikan: dateFormat(val.withdraw_time).format('llll'),
					historyTopupSaldo: storeFindBalanceHistory[i],
					tanggalPembuatan: dateFormat(val.saldo_created).format('llll')
				}
			}
		}
	)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: newBalanceUsers
	})
}
