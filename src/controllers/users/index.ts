import { register } from './user.register'
import { login } from './user.login'
import { activation } from './user.activation'
import { resend } from './user.resend'

export const userController = {
	register,
	login,
	activation,
	resend
}
