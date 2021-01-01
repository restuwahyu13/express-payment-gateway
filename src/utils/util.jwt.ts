import jwt, { SignOptions, Secret } from 'jsonwebtoken'
import { isValid, Base64 } from 'js-base64'
import { UsersDTO } from './../dto/users'

const jwtSecret: Secret = process.env.JWT_SECRET

export const encodedJwt = (data: UsersDTO, options: SignOptions): string => {
	const token: string = jwt.sign({ ...data }, jwtSecret, { ...options })
	return Base64.encode(token)
}

export const decodedJwt = (token: string): string | any => {
	if (!isValid(token)) {
		throw new TypeError('base64 token is not valid')
	}
	const decodeToken: string = Base64.decode(token)
	return decodeToken
}
