import { Request, Response } from 'express'
import knex from '../../database'
import { UsersDTO } from '../../dto/dto.users'
import { WithdrawDTO } from '../../dto/dto.withdraw'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { dateFormat } from '../../utils/util.date'
import {
	IFindParamsWithdrawAmount,
	IFindWithdrawAmount,
	IFindNewWithdrawAmount,
	IFindParamsWithdrawAmountHistory,
	IFindNewParamsWithdrawAmountHistory,
	IFindWithdrawAmountHistory,
	IFinNewdWithdrawAmountHistory
} from '../../interface/i.withdraw'

export const resultsWithdraw = async (req: Request, res: Response): Promise<Response<any>> => {
	const findWithdrawAmount: IFindWithdrawAmount[] = await knex<WithdrawDTO, UsersDTO>('withdraw')
		.join('users', 'users.user_id', 'withdraw.user_id')
		.select([
			'users.user_id',
			'users.email',
			'users.noc_transfer',
			knex.raw('SUM (withdraw.withdraw_amount) as total_withdraw_amount')
		])
		.groupBy(['users.user_id', 'users.email', 'users.noc_transfer'])
		.orderBy('users.user_id', 'asc')

	if (findWithdrawAmount.length < 1) {
		return res.status(200).json({
			status: res.statusCode,
			method: req.method,
			message: 'data is not exist'
		})
	}

	const findWithdrawAmountHistory = findWithdrawAmount.map(
		async (val: IFindParamsWithdrawAmountHistory): Promise<Array<IFinNewdWithdrawAmountHistory>> => {
			const findSaldoTo: IFindWithdrawAmountHistory[] = await knex<WithdrawDTO, UsersDTO>('withdraw')
				.join('users', 'users.user_id', 'withdraw.user_id')
				.select([
					'users.user_id',
					'users.email',
					'users.noc_transfer',
					'withdraw.withdraw_id',
					'withdraw.withdraw_amount',
					'withdraw.withdraw_time'
				])
				.where({ 'users.user_id': val.user_id })
				.groupBy([
					'users.user_id',
					'users.email',
					'users.noc_transfer',
					'withdraw.withdraw_id',
					'withdraw.withdraw_amount',
					'withdraw.withdraw_time'
				])
				.orderBy('withdraw.withdraw_time', 'desc')

			const newFindWithdrawAmountHistory = findSaldoTo.map(
				(val: IFindNewParamsWithdrawAmountHistory): IFinNewdWithdrawAmountHistory => ({
					transfer_id: val.withdraw_id,
					email: val.email,
					kode_transfer: val.noc_transfer,
					nominal_withdraw: rupiahFormatter(val.withdraw_amount.toString()),
					tanggal_withdraw: dateFormat(val.withdraw_time).format('llll')
				})
			)

			return newFindWithdrawAmountHistory
		}
	)

	const newWithdrawAmount = findWithdrawAmount.map(
		async (val: IFindParamsWithdrawAmount, i: number): Promise<IFindNewWithdrawAmount> => ({
			withdraw_history: {
				user_id: val.user_id,
				email: val.email,
				kode_transfer: val.noc_transfer,
				total_nominal_withdraw: rupiahFormatter(val.total_withdraw_amount.toString()),
				total_withdraw: await findWithdrawAmountHistory[i]
			}
		})
	)

	const withdrawAmount: any[] = []
	for (const i of newWithdrawAmount) {
		withdrawAmount.push(await i)
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: await withdrawAmount
	})
}
