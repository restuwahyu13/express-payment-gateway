import { Request, Response } from 'express'
import knex from '../../database'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import { tempMailReset } from '../../templates/template.reset'
import { signAccessToken } from '../../utils/util.jwt'
import { expressValidator } from '../../utils/util.validator'
import { UsersDTO } from '../../dto/dto.users'
import { IResetMail } from '../../interface/i.tempmail'
import { IJwt } from '../../interface/i.jwt'
sgMail.setApiKey(process.env.SG_SECRET)

export const forgot = async (req: Request, res: Response): Promise<Response<any>> => {
	const errors = expressValidator(req)

	if (errors.length > 0) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			errors
		})
	}

	const findUser: UsersDTO[] = await knex<UsersDTO>('users').where({ email: req.body.email }).select()

	if (findUser.length < 1) {
		return res.status(404).json({
			status: res.statusCode,
			method: req.method,
			message: 'User account for this email is not exitst, please register'
		})
	}

	if (findUser[0].active === false) {
		return res.status(400).json({
			status: res.statusCode,
			method: req.method,
			message: 'user account is not active, please resend new activation token'
		})
	}

	const { user_id, email }: UsersDTO = findUser[0]
	const { accessToken }: IJwt = signAccessToken()(req, res, { user_id: user_id, email: email }, { expiresIn: '1d' })
	const template: IResetMail = tempMailReset(email, accessToken)

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
