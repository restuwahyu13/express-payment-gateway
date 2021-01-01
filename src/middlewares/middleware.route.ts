import { Application, Request, Response } from 'express'
import userRoute from '../routes/route.user'

export const routeMiddleware = (app: Application): void => {
	app.use('/api/v1', userRoute)
}
