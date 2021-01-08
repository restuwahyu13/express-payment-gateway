import bcryptjs from 'bcryptjs'

export const hashPassword = (password: string): string => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))

export const verifyPassword = (password: string, hashPassword: string, callback: any): void =>
	bcryptjs.compare(password, hashPassword, (err: any, success: boolean): void => callback(err, success))
