import bcryptjs from 'bcryptjs'

export const hashPassword = (password: string): string => bcryptjs.hashSync(password, bcryptjs.genSaltSync(10))

export const verifyPassword = (password: string, hashPassword: string, callback: any) =>
	bcryptjs.compare(password, hashPassword, (err: any, success: boolean) => callback(err, success))
