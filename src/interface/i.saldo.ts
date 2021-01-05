export interface IParamsFindBalance {
	readonly saldo_user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_balance: number
	readonly withdraw_amount: number
	readonly withdraw_time: any
	readonly saldo_created: any
}

export interface IFindBalance {
	readonly saldo_user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_balance: number
	readonly withdraw_amount: number
	readonly withdraw_time: any
	readonly saldo_created: any
}

export interface IParamsFindBalanceHistory {
	readonly user_id: number
	readonly balance: number
	readonly topup_method: string
	readonly created_at: any
}

export interface IFindBalanceHistory {
	readonly user_id: number
	readonly balance: number
	readonly topup_method: string
	readonly total_balance: number
	readonly created_at: any
}

export interface INewFindBalanceHistory {
	readonly user_id: number
	readonly saldoTopup: string
	readonly nominal_topup: string
	readonly tanggal_topup: any
}

type NewBalance = {
	readonly user_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly jumlah_uang: string
	readonly jumlah_penarikan: string
	readonly waktu_penarikan: any
	readonly topup_history: INewFindBalanceHistory[]
	readonly tanggal_pembuatan: any
}

export interface INewFindBalance {
	readonly saldo_history: NewBalance
}
