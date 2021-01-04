import { Request, Response } from 'express'
import knex from '../../database'
import { SaldoHistoryDTO } from '../../dto/dto.saldoHistory'
import { TopupsDTO } from '../../dto/dto.topups'
import { SaldoDTO } from '../../dto/dto.saldo'
import { UsersDTO } from '../../dto/dto.users'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { dateFormat } from '../../utils/util.date'
import { IFindBalanceHistory, IFindBalance, INewBalanceUsers, INewFindBalanceHistory } from '../../interface/i.saldo'

export const resultSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const findBalanceHistory: IFindBalanceHistory[] = await knex<SaldoHistoryDTO, TopupsDTO>('saldo_history')
		.join('topups', 'topups.topup_id', 'saldo_history.topup_id')
		.select(['topups.user_id', 'topups.topup_method', 'saldo_history.balance', 'saldo_history.created_at'])
		.where({ user_id: req.params.id })
		.groupBy(['topups.user_id', 'topups.topup_method', 'saldo_history.balance', 'saldo_history.created_at'])
		.orderBy('created_at', 'desc')

	if (findBalanceHistory.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, failed to find saldo'
		})
	}

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
		.where({ 'users.user_id': findBalanceHistory[0].user_id })

	const newFindBalanceHistory = findBalanceHistory.map(
		(val): INewFindBalanceHistory => ({
			user_id: val.user_id,
			saldoTopup: rupiahFormatter(val.balance.toString()),
			metodePembayaran: val.topup_method,
			tanggalTopup: dateFormat(val.created_at).format('llll')
		})
	)

	const newBalanceUsers = findBalance.map(
		(val): INewBalanceUsers => {
			return {
				reportSaldoUser: {
					user_id: val.saldo_user_id,
					email: val.email,
					kodeTransfer: val.noc_transfer,
					jumlahUang: rupiahFormatter(val.total_balance.toString()),
					jumlahPenarikan: rupiahFormatter(val.withdraw_amount.toString()),
					waktuPenarikan: dateFormat(val.withdraw_time).format('llll'),
					historyTopupSaldo: newFindBalanceHistory,
					tanggalPembuatan: dateFormat(val.saldo_created).format('llll')
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
