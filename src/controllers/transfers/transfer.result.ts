import { Request, Response } from 'express'
import knex from '../../database'
import { TransferDTO } from '../../dto/dto.transfer'
import { UsersDTO } from '../../dto/dto.users'
import { dateFormat } from './../../utils/util.date'
import { rupiahFormatter } from './../../utils/util.rupiah'
import {
	IFindTransferFrom,
	IFindNewTransferFrom,
	IFindParamsTransferFrom,
	IFindTransferTo,
	IFindNewTransferTo,
	IFindParamsTransferTo,
	IFindNewParamsTransferTo
} from '../../interface/i.transfer'

export const resultTransfer = async (req: Request, res: Response): Promise<Response<any>> => {
	const findTransferSaldoFrom: IFindTransferFrom[] = await knex<TransferDTO, UsersDTO>('transfer')
		.join('users', 'users.user_id', 'transfer.transfer_from')
		.select([
			'users.user_id',
			'users.email',
			'users.noc_transfer',
			knex.raw('SUM(transfer.transfer_amount) as total_transfer_amount'),
			'transfer.transfer_to'
		])
		.where({ 'users.user_id': req.params.id })
		.groupBy(['users.user_id', 'users.email', 'users.noc_transfer', 'transfer.transfer_to'])
		.orderBy('users.user_id', 'asc')

	const findUser: UsersDTO[] = await knex<UsersDTO>('users').select('email').where({ user_id: req.params.id })

	if (findTransferSaldoFrom.length < 1 && findUser.length > 0) {
		return res.status(200).json({
			status: res.statusCode,
			method: req.method,
			message: `${findUser[0].email} you never transfer money to other people`
		})
	}

	const findTransferSaldoTo = findTransferSaldoFrom.map(
		async (val: IFindParamsTransferTo): Promise<Array<IFindNewTransferTo>> => {
			const findSaldoTo: IFindTransferTo[] = await knex<TransferDTO, UsersDTO>('transfer')
				.join('users', 'users.user_id', 'transfer.transfer_to')
				.select([
					'users.user_id',
					'users.email',
					'users.noc_transfer',
					'transfer.transfer_id',
					'transfer.transfer_amount',
					'transfer.transfer_time'
				])
				.where({ 'users.user_id': val.transfer_to })
				.groupBy([
					'users.user_id',
					'users.email',
					'users.noc_transfer',
					'transfer.transfer_id',
					'transfer.transfer_amount',
					'transfer.transfer_time'
				])
				.orderBy('transfer.transfer_time', 'desc')

			const newfindSaldoTo = findSaldoTo.map(
				(val: IFindNewParamsTransferTo): IFindNewTransferTo => ({
					transfer_id: val.transfer_id,
					email: val.email,
					kode_transfer: val.noc_transfer,
					nominal_transfer: rupiahFormatter(val.transfer_amount.toString()),
					tanggal_transfer: dateFormat(val.transfer_time).format('llll')
				})
			)

			return newfindSaldoTo
		}
	)

	const newTransferSaldo = findTransferSaldoFrom.map(
		async (val: IFindParamsTransferFrom): Promise<IFindNewTransferFrom> => ({
			transfer_history: {
				user_id: val.user_id,
				email: val.email,
				kode_transfer: val.noc_transfer,
				total_nominal_transfer: rupiahFormatter(val.total_transfer_amount.toString()),
				total_transfer: await findTransferSaldoTo[0]
			}
		})
	)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: await newTransferSaldo[0]
	})
}
