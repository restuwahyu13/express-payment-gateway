export interface IFindBalance {
	user_id: number
	saldo_balance: number
	saldo_withdraw: number
}

export interface IMergeUsers {
	data: {
		email: string
		noc_transfer: number
	}
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
