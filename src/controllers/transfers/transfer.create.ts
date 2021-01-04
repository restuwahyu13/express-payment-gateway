import { Request, Response } from 'express'
import knex from '../../database'
import { TransferDTO } from '../../dto/dto.transfer'
import { UsersDTO } from '../../dto/dto.users'
import { dateFormat } from '../../utils/util.date'
import { IFindBalance } from '../../interface/i.saldo'

export const createTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	const { from_user, to_user, transfer_amount }: TransferDTO = req.body

	const checkUserId = await knex<UsersDTO>('users')
		.whereIn('noc_transfer', [from_user, to_user])
		.select(['user_id', 'email', 'noc_transfer'])

	if (checkUserId.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, transfer balance failed'
		})
	}

	const saveTransfer: TransferDTO[] = await knex<TransferDTO>('transfer').insert({
		transfer_from: checkUserId[0],
		transfer_to: checkUserId[1],
		transfer_amount: transfer_amount,
		transfer_time: dateFormat(new Date()),
		created_at: new Date()
	})

	const findBalance: IFindBalance[] = await knex<SaldoDTO, TopupsDTO>('saldo')
		.join('topups', 'topups.topup_id', 'saldo.topup_id')
		.select([
			'topups.user_id',
			knex.raw('SUM(saldo.balance) as saldo_balance'),
			knex.raw('SUM(saldo.withdraw) as saldo_withdraw')
		])
		.where({ user_id: req.params.id })
		.groupBy(['topups.user_id'])
		.orderBy('topups.user_id', 'asc')

	const { saldo_balance }: IFindBalance = findBalance[0]
	const withdrawAmount = saldo_balance - transfer_amount

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'Hello Wordl'
	})
}
