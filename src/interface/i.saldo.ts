export interface IFindBalanceHistory {
	user_id: number
	total_balance: number
}

export interface IFindBalance {
	user_id: number
	total_balance: number
}

type Data = {
	email: string
	noc_transfer: number
}

export interface IMergeUsers {
	data: Data
	saldo_balance: number
	saldo_withdraw: number
	user_id: number
}

export interface INewUsers {
	user_id: number
	email: string
	kodeTransfer: number
	jumlahUang: string
	jumlahPenarikan: string
}
