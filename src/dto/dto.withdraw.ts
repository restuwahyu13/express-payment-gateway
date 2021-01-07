interface IWithdraw {
	readonly withdraw_id?: number
	readonly user_id?: number
	readonly withdraw_amount?: number
	readonly withdraw_time?: any
	readonly created_at?: any
	readonly updated_at?: any
}

export class WithdrawDTO implements IWithdraw {
	readonly withdraw_id?: number
	readonly user_id?: number
	readonly withdraw_amount?: number
	readonly withdraw_time?: any
	readonly created_at?: any
	readonly updated_at?: any
}
