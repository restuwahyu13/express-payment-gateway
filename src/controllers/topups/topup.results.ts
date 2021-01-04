import { Request, Response } from 'express'
import knex from '../../database'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'
import { dateFormat } from '../../utils/util.date'
import { rupiahFormatter } from '../../utils/util.rupiah'
import { IAllUserTopup, IUserTopup } from '../../interface/i.topup'

export const resultsTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	const findAllTopup: IAllUserTopup[] = await knex<UsersDTO, TopupsDTO>('topups')
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

	if (findAllTopup.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'data is not exist'
		})
	}

	const newTopupData = findAllTopup.map(
		(val): IUserTopup => {
			return {
				userTopup: {
					topup_id: val.topup_id,
					nomor_topup: val.topup_no,
					jumlah_topup: rupiahFormatter(val.topup_amount.toString()),
					metodePembayaran_topup: val.topup_method,
					waktu_topup: dateFormat(val.topup_time).format('llll'),
					userData: {
						user_id: val.user_id,
						email: val.email,
						photoProfile: val.photo,
						kode_transfer: val.noc_transfer,
						pertama_login: dateFormat(val.first_login).format('llll'),
						terakhir_login: val.last_login
					}
				}
			}
		}
	)

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: 'data already to use',
		data: newTopupData
	})
}
