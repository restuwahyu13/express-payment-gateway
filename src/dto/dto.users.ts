interface IUsers {
	readonly user_id?: number
	readonly email?: string
	readonly password?: string
	readonly photo?: string
	readonly active?: boolean
	readonly noc_transfer?: number
	readonly first_login?: any
	readonly last_login?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}

export class UsersDTO implements IUsers {
	readonly user_id?: number
	readonly email?: string
	readonly password?: string
	readonly photo?: string
	readonly active?: boolean
	readonly noc_transfer?: number
	readonly role?: string
	readonly first_login?: any
	readonly last_login?: any
	readonly created_at?: Date
	readonly updated_at?: Date
}
