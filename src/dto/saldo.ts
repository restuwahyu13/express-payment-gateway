interface ISaldo {
	readonly saldo_id?: number
	readonly topup_id: number
	readonly balance: number
	readonly withdraw?: number
	readonly created_at?: any
	readonly updated_at?: any
}

export class SaldoDTO implements ISaldo {
	readonly saldo_id?: number
	readonly topup_id: number
	readonly balance: number
	readonly withdraw?: number
	readonly created_at?: any
	readonly updated_at?: any
}
