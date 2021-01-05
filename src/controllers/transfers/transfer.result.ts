import { Request, Response } from 'express'
import knex from '../../database'
import { TransferDTO } from '../../dto/dto.transfer'
import { UsersDTO } from '../../dto/dto.users'
import {
	IFindSaldoFrom,
	IFindTransferHistory,
	IFindParamsTransferHistory,
	IFindNewTransferHistory
} from '../../interface/i.transfer'
import { dateFormat } from './../../utils/util.date'
import { rupiahFormatter } from './../../utils/util.rupiah'

export const resultTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	const findSaldoFrom: IFindSaldoFrom[] = await knex<TransferDTO, UsersDTO>('transfer')
		.join('users', 'users.user_id', 'transfer.transfer_from')
		.select([
			'users.user_id',
			'users.email',
			'users.noc_transfer',
			'transfer.transfer_amount',
			'transfer.transfer_to',
			'transfer.transfer_time'
		])
		.where({ transfer_from: req.params.id })

	if (findSaldoFrom.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'user id is not exist, in the system'
		})
	}

	const findSaldoTo: UsersDTO[] = await knex<UsersDTO>('users')
		.select(['user_id', 'email', 'noc_transfer', 'first_login', 'last_login'])
		.where({ user_id: findSaldoFrom[0].transfer_to })

	const transferHistory = findSaldoFrom.map(
		(): IFindTransferHistory => {
			const { user_id, email, noc_transfer, first_login, last_login }: UsersDTO = findSaldoTo[0]
			return Object.defineProperty(findSaldoFrom[0], 'transfer_to', {
				value: { user_id, email, noc_transfer, first_login, last_login },
				writable: true,
				enumerable: true
			})
		}
	)

	const newTransferHistory = transferHistory.map(
		(val: IFindParamsTransferHistory): IFindNewTransferHistory => {
			return {
				transfer_history: {
					user_id: val.user_id,
					email: val.email,
					kode_transfer: val.noc_transfer,
					jumlah_transfer: rupiahFormatter(val.transfer_amount.toString()),
					transfer_ke: {
						user_id: val.transfer_to.user_id,
						email: val.transfer_to.email,
						pertama_masuk: dateFormat(val.first_login).format('llll'),
						terakhir_masuk: dateFormat(val.last_login).format('llll')
					},
					tanggal_transfer: dateFormat(val.transfer_time).format('llll')
				}
			}
		}
	)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: newTransferHistory[0]
	})
}
