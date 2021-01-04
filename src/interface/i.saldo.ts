export interface IFindBalanceHistory {
	user_id: number
	total_balance: number
	created_at: any
}

export interface IFindBalance {
	user_id: number
	email: string
	noc_transfer: number
	total_balance: number
	created_at: any
}

export interface INewFindBalanceHistory {
	user_id: number
	saldoTopup: string
	metodePembayaran: string
	tanggalTopup: any
}

export interface INewBalanceUsers {
	user_id: number
	email: string
	kodeTransfer: number
	jumlahUang: string
	jumlahPenarikan: string
	waktuPenarikan: any
	historyTopupSaldo: INewFindBalanceHistory
	tanggalPembuatan: any
}
