import { Application } from 'express'
import userRoute from '../routes/route.user'
import topupRoute from '../routes/route.topup'
import transferRoute from '../routes/route.transfer'
import saldoRoute from '../routes/route.saldo'
import refreshRoute from '../routes/route.refresh'

export const routeMiddleware = (app: Application): void => {
	app.use('/api/v1', userRoute)
	app.use('/api/v1', topupRoute)
	app.use('/api/v1', transferRoute)
	app.use('/api/v1', saldoRoute)
	app.use('/api/v1', refreshRoute)
}
