import { Request, Response } from 'express'
import knex from '../../database'
import { SaldoHistoryDTO } from '../../dto/dto.saldoHistory'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { IFindBalanceHistory, IMergeUsers, INewUsers } from '../../interface/i.saldo'

export const resultSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const findBalanceHistory: IFindBalanceHistory[] = await knex<SaldoHistoryDTO, TopupsDTO>('saldo_history')
		.join('topups', 'topups.topup_id', 'saldo_history.topup_id')
		.select(['topups.user_id'])
		.where({ user_id: req.params.id })
		.groupBy(['topups.user_id'])

	// const findBalanceHistory: IFindBalanceHistory[] = await knex<SaldoHistoryDTO, TopupsDTO>('saldo_history')
	// 	.join('topups', 'topups.topup_id', 'saldo.topup_id')
	// 	.select([
	// 		'topups.user_id',
	// 		knex.raw('SUM(saldo.balance) as saldo_balance'),
	// 		knex.raw('SUM(saldo.withdraw) as saldo_withdraw')
	// 	])
	// 	.where({ user_id: req.params.id })
	// 	.groupBy(['topups.user_id'])
	// 	.orderBy('topups.user_id', 'asc')

	if (findBalanceHistory.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, failed to find saldo',
			data: findBalanceHistory
		})
	}

	// const findAllUserId = findBalanceHistory.map((val): number => val.user_id)
	// const findUsers: UsersDTO[] = await knex<UsersDTO>('users')
	// 	.select(['email', 'noc_transfer'])
	// 	.whereIn('user_id', findAllUserId)

	// const mergeUsers = findUsers.map(
	// 	(val, i): IMergeUsers => {
	// 		const userMerge: IMergeUsers = Object.defineProperty(findBalanceHistory[i], 'data', {
	// 			value: { email: val.email, noc_transfer: val.noc_transfer },
	// 			enumerable: true,
	// 			writable: true
	// 		})
	// 		return userMerge
	// 	}
	// )

	// const newUsers = mergeUsers.map(
	// 	(val): INewUsers => ({
	// 		user_id: val.user_id,
	// 		email: val.data.email,
	// 		kodeTransfer: val.data.noc_transfer,
	// 		jumlahUang: rupiahFormatter(val.saldo_balance.toString()),
	// 		jumlahPenarikan: rupiahFormatter(val.saldo_withdraw.toString())
	// 	})
	// )

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: findBalanceHistory
	})
}
