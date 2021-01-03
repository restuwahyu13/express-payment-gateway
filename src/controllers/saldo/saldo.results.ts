import { Request, Response } from 'express'
import knex from '../../database'
import { SaldoDTO } from '../../dto/dto.saldo'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { IFindBalance, IMergeUsers, INewUsers } from '../../interface/i.saldo'

export const resultsSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const findBalance: IFindBalance[] = await knex<SaldoDTO, TopupsDTO>('saldo')
		.join('topups', 'topups.topup_id', 'saldo.topup_id')
		.select([
			'topups.user_id',
			knex.raw('SUM(saldo.balance) as saldo_balance'),
			knex.raw('SUM(saldo.withdraw) as saldo_withdraw')
		])
		.groupBy(['topups.user_id'])
		.orderBy('topups.user_id', 'asc')

	const findAllUserId = findBalance.map((val): number => val.user_id)
	const findUsers: UsersDTO[] = await knex<UsersDTO>('users')
		.select(['email', 'noc_transfer'])
		.whereIn('user_id', findAllUserId)

	const mergeUsers = findUsers.map(
		(val, i): IMergeUsers => {
			const userMerge: IMergeUsers = Object.defineProperty(findBalance[i], 'data', {
				value: { email: val.email, noc_transfer: val.noc_transfer },
				enumerable: true,
				writable: true
			})
			return userMerge
		}
	)

	const newUsers = mergeUsers.map(
		(val): INewUsers => ({
			user_id: val.user_id,
			email: val.data.email,
			kodeTransfer: val.data.noc_transfer,
			jumlahUang: rupiahFormatter(val.saldo_balance.toString()),
			jumlahPenarikan: rupiahFormatter(val.saldo_withdraw.toString())
		})
	)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: newUsers
	})
}
