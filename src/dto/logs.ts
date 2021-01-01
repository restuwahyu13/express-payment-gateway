interface ILogs {
	readonly logs_id?: number
	readonly user_id?: number
	readonly status?: string
	readonly created_at?: any
	readonly updated_at?: any
}

export class LogsDTO implements ILogs {
	readonly logs_id?: number
	readonly status?: string
	readonly created_at?: any
	readonly updated_at?: any
}
