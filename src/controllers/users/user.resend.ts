import { Request, Response } from 'express'
import knex from '../../database'
import sgMail from '@sendgrid/mail'
import { ClientResponse } from '@sendgrid/client/src/response'
import { UsersDTO } from '../../dto/dto.users'
import { tempMailResend } from '../../templates/template.resend'
import { signAccessToken } from '../../utils/util.jwt'
import { IResendMail } from '../../interface/i.tempmail'
import { IJwt } from '../../interface/i.jwt'
import { expressValidator } from '../../utils/util.validator'
sgMail.setApiKey(process.env.SG_SECRET)

export const resend = async (req: Request, res: Response): Promise<Response<any>> => {
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

	if (findUser[0].active === true) {
		return res.status(200).json({
			status: res.statusCode,
			method: req.method,
			message: 'User account hash been active, please login'
		})
	}

	const { user_id, email }: UsersDTO = findUser[0]
	const { accessToken }: IJwt = signAccessToken()(req, res, { user_id: user_id, email: email }, { expiresIn: '5m' })
	const template: IResendMail = tempMailResend(email, accessToken)

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
		message: `resend new token activation successfully, please check your email ${email}`
	})
}
