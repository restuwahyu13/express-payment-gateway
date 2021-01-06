// export interface IUserTopupAll {
// 	readonly user_id: number
// 	readonly email: string
// 	readonly photo: string
// 	readonly noc_transfer: number
// 	readonly first_login: any
// 	readonly last_login: any
// 	readonly topup_id: number
// 	readonly topup_no: number
// 	readonly topup_amount: string
// 	readonly topup_method: string
// 	readonly topup_time: any
// }

// export interface IUserTopupParams {
// 	readonly user_id: number
// 	readonly email: string
// 	readonly photo: string
// 	readonly noc_transfer: number
// 	readonly first_login: any
// 	readonly last_login: any
// 	readonly topup_id: number
// 	readonly topup_no: number
// 	readonly topup_amount: string
// 	readonly topup_method: string
// 	readonly topup_time: any
// }

// type UserTopopSub = {
// 	readonly user_id: number
// 	readonly email: string
// 	readonly kode_transfer: number
// 	readonly pertama_masuk: any
// 	readonly terakhir_masuk: any
// }

// type UserTopop = {
// 	readonly topup_id: number
// 	readonly kode_topup: number
// 	readonly jumlah_topup: string
// 	readonly metode_pembayaran: string
// 	readonly user: UserTopopSub
// 	readonly tanggal_topup: any
// }

// export interface IUserTopup {
// 	readonly topup_history: UserTopop
// }

/**
=============================
Find Topup Amount Teritory
=============================
*/

type FindTopup = {
	readonly user_id: number
	readonly nominal_topup: string | number
	readonly metode_pembayaran: string
	readonly tanggal_topup: any
}

export interface IFindTopup {
	readonly topup_id: number
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_topup_amount: number
	readonly total_topup: FindTopup
}

export interface IFindParamsTopup {
	readonly user_id: number
	readonly topup_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_topup_amount: number
}

type FindSubTopupAmount = {
	readonly topup_id: number
	readonly kode_topup: string
	readonly nominal_topup: string | number
	readonly metode_pembayaran: string
	readonly tanggal_topup: any
}

type FindTopupAmount = {
	readonly user_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly total_nominal_topup: string
	readonly total_topup: FindSubTopupAmount[]
}

export interface IFindNewTopup {
	readonly topup_history: FindTopupAmount
}

/**
=============================
Find Topup Amount History Teritory
=============================
*/

export interface IFindParamsHistoryTopup {
	readonly topup_id: number
	readonly user_id: number
	readonly topup_no: string
	readonly topup_amount: number
	readonly topup_method: string
	readonly topup_time: any
}

export interface IFindTopupHistory {
	readonly topup_id: number
	readonly user_id: number
	readonly topup_no: string
	readonly topup_amount: number
	readonly topup_method: string
	readonly topup_time: any
}

export interface IFindNewTopupHistory {
	readonly topup_id: number
	readonly kode_topup: string
	readonly nominal_topup: string | number
	readonly metode_pembayaran: string
	readonly tanggal_topup: any
}
