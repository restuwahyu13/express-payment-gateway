interface ITopups {
	readonly topup_id?: number
	readonly user_id: number
	readonly no_payment: string
	readonly amount: number
	readonly payment_method: string
	readonly created_at?: any
	readonly updated_at?: any
}

export class TopupsDTO implements ITopups {
	readonly topup_id?: number
	readonly user_id: number
	readonly no_payment: string
	readonly amount: number
	readonly payment_method: string
	readonly created_at?: any
	readonly updated_at?: any
}
