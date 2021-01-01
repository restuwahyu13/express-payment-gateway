interface IUsers {
	readonly user_id?: number
	readonly email?: string
	readonly password?: string
	readonly photo?: string
	readonly active?: boolean
	readonly first_login?: any
	readonly last_login?: any
	readonly created_at?: any
	readonly updated_at?: any
}

export class UsersDTO implements IUsers {
	readonly user_id?: number
	readonly email?: string
	readonly password?: string
	readonly photo?: string
	readonly active?: boolean
	readonly first_login?: any
	readonly last_login?: any
	readonly created_at?: any
	readonly updated_at?: any
}
