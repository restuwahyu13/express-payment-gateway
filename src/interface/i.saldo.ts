export interface IFindBalance {
	readonly saldo_user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_balance: number
	readonly withdraw_amount: number
	readonly withdraw_time: any
	readonly saldo_created: any
}

export interface IFindParamsBalance {
	readonly saldo_user_id: number
	readonly email: string
	readonly noc_transfer: number
	readonly total_balance: number
	readonly withdraw_amount: number
	readonly withdraw_time: any
	readonly saldo_created: any
}

type FindNewBalance = {
	readonly user_id: number
	readonly email: string
	readonly kode_transfer: number
	readonly jumlah_uang: string
}

export interface IFindNewBalance {
	readonly saldo_history: FindNewBalance
}

/**
 * ==================================
 *  Find Balance History Teritory
 * ==================================
 */

export interface IFindBalanceHistory {
	readonly user_id: number
	readonly total_balance: number
	readonly topup_time: any
}

export interface IFindParamsBalanceHistory {
	readonly user_id: number
	readonly balance: number
	readonly topup_method: string
	readonly created_at: any
}

export interface IFinNewdBalanceHistory {
	readonly user_id: number
	readonly saldo_topup: string | number
	readonly metode_pembayaran: string
	readonly tanggal_topup: any
}
