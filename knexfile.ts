import 'dotenv/config'
import { resolve } from 'path'

export default {
	development: {
		client: 'pg',
		connection: {
			host: process.env.PG_HOST,
			user: process.env.PG_USERNAME,
			password: process.env.PG_PASSWORD,
			database: process.env.PG_DATABASE,
			port: process.env.PG_PORT
		},
		migrations: {
			directory: resolve(process.cwd(), 'src/database/migrations/')
		},
		seeds: {
			directory: resolve('src/database/seeds/')
		},
		log: {
			error: (msg: string | any): void => console.error(msg),
			warn: (msg: string | any): void => console.error(msg)
		}
	},
	production: {
		client: 'pg',
		connection: process.env.PG_URI,
		pool: { min: 1, max: 10 },
		migrations: {
			directory: resolve(process.cwd(), 'src/database/migrations/')
		}
	}
}
