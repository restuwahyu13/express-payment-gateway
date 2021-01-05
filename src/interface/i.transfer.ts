export interface IFindSaldoFrom {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly transfer_amount: number
	readonly transfer_to: number
	readonly transfer_time: any
}

type ParamsTransferHistory = {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly first_login: any
	readonly last_login: any
}

export interface IFindParamsTransferHistory {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly first_login: any
	readonly last_login: any
	readonly transfer_amount: number
	readonly transfer_to: ParamsTransferHistory
	readonly transfer_time: any
}

type FindSubTransferHistory = {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
}

type FindTransferHistory = {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly first_login: any
	readonly last_login: any
	readonly transfer_amount: number
	readonly transfer_to: FindSubTransferHistory
	readonly transfer_time: any
}

export interface IFindTransferHistory {
	readonly user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly first_login: any
	readonly last_login: any
	readonly transfer_amount: number
	readonly transfer_to: FindTransferHistory
	readonly transfer_time: any
}

type FindSubNewTransferHistory = {
	readonly user_id: number
	readonly email: string
	readonly pertama_masuk: any
	readonly terakhir_masuk: any
}

type FindNewTransferHistory = {
	readonly user_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly jumlah_transfer: string
	readonly transfer_ke: FindSubNewTransferHistory
	readonly tanggal_transfer: any
}

export interface IFindNewTransferHistory {
	readonly transfer_history: FindNewTransferHistory
}
