interface ITransfer {
	readonly transfer_id?: number
	readonly from_user_id: number
	readonly to_user_id: number
	readonly amount: number
	readonly created_at?: any
	readonly updated_at?: any
}

export class TransferDTO implements ITransfer {
	readonly transfer_id?: number
	readonly from_user_id: number
	readonly to_user_id: number
	readonly amount: number
	readonly created_at?: any
	readonly updated_at?: any
}
