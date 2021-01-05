import { Request, Response } from 'express'
import knex from '../../database'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'
import { dateFormat } from '../../utils/util.date'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { IUserTopupAll, IUserTopup } from '../../interface/i.topup'

export const resultTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	const findTopup: IUserTopupAll[] = await knex<UsersDTO, TopupsDTO>('topups')
		.join('users', 'topups.user_id', 'users.user_id')
		.select([
			'users.user_id',
			'users.email',
			'users.photo',
			'users.noc_transfer',
			'users.first_login',
			'users.last_login',
			'topups.topup_id',
			'topups.topup_no',
			'topups.topup_amount',
			'topups.topup_method',
			'topups.topup_time'
		])
		.where({ topup_id: req.params.id })

	if (findTopup.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'topup id is not exist, in the system'
		})
	}

	const newTopupData = findTopup.map(
		(val): IUserTopup => {
			return {
				topup_history: {
					topup_id: val.topup_id,
					kode_topup: val.topup_no,
					jumlah_topup: rupiahFormatter(val.topup_amount.toString()),
					metode_pembayaran: val.topup_method,
					user: {
						user_id: val.user_id,
						email: val.email,
						kode_transfer: val.noc_transfer,
						pertama_masuk: dateFormat(val.first_login).format('llll'),
						terakhir_masuk: val.last_login
					},
					tanggal_topup: dateFormat(val.topup_time).format('llll')
				}
			}
		}
	)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: newTopupData[0]
	})
}
