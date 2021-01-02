interface ITopups {
	readonly topup_id?: number
	readonly user_id?: number
	readonly topup_no?: string
	readonly topup_amount?: number
	readonly topup_method?: string
	readonly topup_time?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}

export class TopupsDTO implements ITopups {
	readonly topup_id?: number
	readonly user_id?: number
	readonly topup_no?: string
	readonly topup_amount?: number
	readonly topup_method?: string
	readonly topup_time?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}
