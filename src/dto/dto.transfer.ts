interface ITransfer {
	readonly transfer_id?: number
	readonly transfer_from?: number
	readonly transfer_to?: number
	readonly transfer_amount?: number
	readonly transfer_time?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}

export class TransferDTO implements ITransfer {
	readonly transfer_id?: number
	readonly transfer_from?: number
	readonly transfer_to?: number
	readonly transfer_amount?: number
	readonly transfer_time?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}
