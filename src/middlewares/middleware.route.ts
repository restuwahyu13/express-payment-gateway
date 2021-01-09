import { Application, Request, Response } from 'express'
import adminRoute from '../routes/route.admin'
import userRoute from '../routes/route.user'
import topupRoute from '../routes/route.topup'
import transferRoute from '../routes/route.transfer'
import saldoRoute from '../routes/route.saldo'
import refreshRoute from '../routes/route.refresh'
import withdrawRoute from '../routes/route.withdraw'

export const routeMiddleware = (app: Application): void => {
	app.use('/api/v1', adminRoute)
	app.use('/api/v1', userRoute)
	app.use('/api/v1', topupRoute)
	app.use('/api/v1', transferRoute)
	app.use('/api/v1', saldoRoute)
	app.use('/api/v1', refreshRoute)
	app.use('/api/v1', withdrawRoute)
	app.get(
		'/',
		(req: Request, res: Response): Response<any> => {
			return res.send('<h1>Welcome To Express Fake Payment Gateway</h1>')
		}
	)
}
