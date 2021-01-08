import { Request, Response } from 'express'
import knex from '../../database'
import { expressValidator } from '../../utils/util.validator'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { SaldoDTO } from '../../dto/dto.saldo'
import { UsersDTO } from '../../dto/dto.users'
import { IFindBalance, IFindParamsBalance, IFindNewBalance } from '../../interface/i.saldo'

export const resultSaldo = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const findBalance: IFindBalance[] = await knex<SaldoDTO, UsersDTO>('saldo')
		.join('users', 'users.user_id', 'saldo.user_id')
		.select([
			'users.user_id as saldo_user_id',
			'users.email',
			'users.noc_transfer',
			'saldo.total_balance',
			'saldo.created_at as saldo_created'
		])
		.where({ 'users.user_id': req.params.id })

	if (findBalance.length < 1) {
		return res.status(200).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist'
		})
	}

	const newBalanceUsers = findBalance.map(
		(val: IFindParamsBalance): IFindNewBalance => {
			return {
				saldo_history: {
					user_id: val.saldo_user_id,
					email: val.email,
					kode_transfer: val.noc_transfer,
					jumlah_uang: rupiahFormatter(val.total_balance.toString())
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
