export interface IAllUserTopup {
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

export interface IUserTopup {
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
