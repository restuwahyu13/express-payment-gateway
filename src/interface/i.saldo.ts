export interface IParamsFindBalance {
	saldo_user_id: number
	email: string
	noc_transfer: number
	total_balance: number
	withdraw_amount: number
	withdraw_time: any
	saldo_created: any
}

export interface IFindBalance {
	saldo_user_id: number
	email: string
	noc_transfer: number
	total_balance: number
	withdraw_amount: number
	withdraw_time: any
	saldo_created: any
}

export interface IParamsFindBalanceHistory {
	user_id: number
	balance: number
	topup_method: string
	created_at: any
}

export interface IFindBalanceHistory {
	user_id: number
	balance: number
	topup_method: string
	total_balance: number
	created_at: any
}

export interface INewFindBalanceHistory {
	user_id: number
	saldoTopup: string
	metodePembayaran: string
	tanggalTopup: any
}

type NewBalance = {
	user_id: number
	email: string
	kodeTransfer: number
	jumlahUang: string
	jumlahPenarikan: string
	waktuPenarikan: any
	historyTopupSaldo: INewFindBalanceHistory[]
	tanggalPembuatan: any
}

export interface INewFindBalance {
	reportSaldoUser: NewBalance
}
