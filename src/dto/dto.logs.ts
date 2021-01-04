interface ILogs {
	readonly logs_id?: number
	readonly user_id?: number
	readonly log_status?: string
	readonly log_time?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}

export class LogsDTO implements ILogs {
	readonly logs_id?: number
	readonly user_id?: number
	readonly log_status?: string
	readonly log_time?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}
