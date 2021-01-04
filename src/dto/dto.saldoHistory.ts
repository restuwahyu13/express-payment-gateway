interface ISaldoHistory {
	readonly saldo_id?: number
	readonly topup_id?: number
	readonly balance?: number
	readonly created_at?: Date
	readonly updated_at?: Date
}

export class SaldoHistoryDTO implements ISaldoHistory {
	readonly saldo_id?: number
	readonly topup_id?: number
	readonly balance?: number
	readonly created_at?: Date
	readonly updated_at?: Date
}
