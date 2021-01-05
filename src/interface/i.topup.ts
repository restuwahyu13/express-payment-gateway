export interface IUserTopupAll {
	readonly user_id: number
	readonly email: string
	readonly photo: string
	readonly noc_transfer: number
	readonly first_login: any
	readonly last_login: any
	readonly topup_id: number
	readonly topup_no: number
	readonly topup_amount: string
	readonly topup_method: string
	readonly topup_time: any
}

export interface IUserTopupParams {
	readonly user_id: number
	readonly email: string
	readonly photo: string
	readonly noc_transfer: number
	readonly first_login: any
	readonly last_login: any
	readonly topup_id: number
	readonly topup_no: number
	readonly topup_amount: string
	readonly topup_method: string
	readonly topup_time: any
}

type UserTopopSub = {
	readonly user_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly pertama_masuk: any
	readonly terakhir_masuk: any
}

type UserTopop = {
	readonly topup_id: number
	readonly kode_topup: number
	readonly jumlah_topup: string
	readonly metode_pembayaran: string
	readonly user: UserTopopSub
	readonly tanggal_topup: any
}

export interface IUserTopup {
	readonly topup_history: UserTopop
}
