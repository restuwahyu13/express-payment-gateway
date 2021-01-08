import { Request, Response } from 'express'
import knex from '../../database'
import { UsersDTO } from '../../dto/dto.users'
import { WithdrawDTO } from '../../dto/dto.withdraw'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { dateFormat } from '../../utils/util.date'
import { expressValidator } from '../../utils/util.validator'
import {
	IFindParamsWithdrawAmount,
	IFindWithdrawAmount,
	IFindNewWithdrawAmount,
	IFindParamsWithdrawAmountHistory,
	IFindNewParamsWithdrawAmountHistory,
	IFindWithdrawAmountHistory,
	IFinNewdWithdrawAmountHistory
} from '../../interface/i.withdraw'

export const resultWithdraw = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const findWithdrawAmount: IFindWithdrawAmount[] = await knex<WithdrawDTO, UsersDTO>('withdraw')
		.join('users', 'users.user_id', 'withdraw.user_id')
		.select([
			'users.user_id',
			'users.email',
			'users.noc_transfer',
			knex.raw('SUM (withdraw.withdraw_amount) as total_withdraw_amount')
		])
		.where({ 'users.user_id': req.params.id })
		.groupBy(['users.user_id', 'users.email', 'users.noc_transfer'])
		.orderBy('users.user_id', 'asc')

	const checkUserId: UsersDTO[] = await knex<UsersDTO>('users').select('email').where({ user_id: req.params.id })

	if (findWithdrawAmount.length < 1 && checkUserId.length > 0) {
		return res.status(200).json({
			status: res.statusCode,
			method: req.method,
			message: `${checkUserId[0].email} you never withdraw money`
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
		async (val: IFindParamsWithdrawAmount): Promise<IFindNewWithdrawAmount> => ({
			withdraw_history: {
				user_id: val.user_id,
				email: val.email,
				kode_transfer: val.noc_transfer,
				total_nominal_withdraw: rupiahFormatter(val.total_withdraw_amount.toString()),
				total_withdraw: await findWithdrawAmountHistory[0]
			}
		})
	)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: await newWithdrawAmount[0]
	})
}
