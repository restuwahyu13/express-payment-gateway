interface ISaldo {
	readonly saldo_id?: number
	readonly user_id?: number
	readonly total_balance?: number
	readonly withdraw?: number
	readonly withdraw_time?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}

export class SaldoDTO implements ISaldo {
	readonly saldo_id?: number
	readonly user_id?: number
	readonly total_balance?: number
	readonly withdraw?: number
	readonly withdraw_time?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}
