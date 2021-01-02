interface ISaldo {
	readonly saldo_id: number
	readonly topup_id: number
	readonly balance: number
	readonly withdraw: number
	readonly withdraw_time: Date
	readonly created_at: Date
	readonly updated_at: Date
}

export class SaldoDTO implements ISaldo {
	readonly saldo_id: number
	readonly topup_id: number
	readonly balance: number
	readonly withdraw: number
	readonly withdraw_time: Date
	readonly created_at: Date
	readonly updated_at: Date
}
