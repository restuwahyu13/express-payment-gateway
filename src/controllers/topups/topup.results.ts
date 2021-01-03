import { Request, Response } from 'express'
import knex from '../../database'
import { TopupsDTO } from '../../dto/dto.topups'
import { UsersDTO } from '../../dto/dto.users'
import { dateFormat } from '../../utils/util.date'

export const resultsTopup = async (req: Request, res: Response): Promise<Response<any>> => {
	interface IAllUserTopup {
		readonly user_id: number
		readonly email: string
		readonly photo: string
		readonly noc_transfer: number
		readonly first_login: any
		readonly last_login: any
		readonly topup_id: number
		readonly topup_no: number
		readonly topup_amount: number
		readonly topup_method: string
		readonly topup_time: any
	}

	interface IUserTopup {
		readonly userData: {
			readonly user_id: number
			readonly email: string
			readonly photoProfile: string
			readonly kode_transfer: number
			readonly pertama_login: string
			readonly terakhir_login: any
			readonly userTopup: {
				readonly topup_id: number
				readonly nomor_topup: number
				readonly jumlah_topup: number
				readonly metodePembayaran_topup: string
				readonly waktu_topup: string
			}
		}
	}

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
			message: 'data is not exists'
		})
	}

	const newTopupData = findAllTopup.map(
		(val): IUserTopup => {
			return {
				userData: {
					user_id: val.user_id,
					email: val.email,
					photoProfile: val.photo,
					kode_transfer: val.noc_transfer,
					pertama_login: dateFormat(val.first_login).format('llll'),
					terakhir_login: val.last_login,
					userTopup: {
						topup_id: val.topup_id,
						nomor_topup: val.topup_no,
						jumlah_topup: val.topup_amount,
						metodePembayaran_topup: val.topup_method,
						waktu_topup: dateFormat(val.topup_time).format('llll')
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
