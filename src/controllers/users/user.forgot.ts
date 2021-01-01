import { Request, Response } from 'express'
import knex from '../../database'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import { UsersDTO } from '../../dto/users'
import { tempMailReset } from '../../templates/template.reset'
import { encodedJwt } from '../../utils/util.jwt'
sgMail.setApiKey(process.env.SG_SECRET)

export const forgot = async (req: Request, res: Response): Promise<Response<any>> => {
	interface IResetMail {
		from: string
		to: string
		subject: string
		html: string
	}

	const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ email: req.body.email }).select('active')

	if (findUser.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'User account for this email is not exitst, please register'
		})
	}

	const { user_id, email }: UsersDTO = findUser[0]
	const token: string = encodedJwt({ user_id, email }, { expiresIn: '5m' })
	const template: IResetMail = tempMailReset(email, token)

	const sgResponse: [ClientResponse, any] = await sgMail.send(template)
	if (!sgResponse) {
		return res.status(500).json({
			status: res.statusCode,
			method: req.method,
			message: 'Server error failed to sending email activation'
		})
	}

	return res.status(200).json({
		status: res.statusCode,
		method: req.method,
		message: `forgot password successfuly, please check your email ${email}`
	})
}
