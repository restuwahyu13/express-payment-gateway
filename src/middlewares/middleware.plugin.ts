import 'dotenv/config'
import { Application } from 'express'
import zlib from 'zlib'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import { cronjob } from '../middlewares/middleware.cronjob'
import morgan from 'morgan'

export const pluginMiddleware = (app: Application): void => {
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(helmet({ contentSecurityPolicy: false }))
	app.use(cors())
	app.use(cookieParser())
	app.use(
		compression({
			level: 9,
			strategy: zlib.constants.Z_RLE
		})
	)
	app.use(
		rateLimit({
			windowMs: 60 * 1000 * 5,
			max: 1000
		})
	)
	app.use(
		slowDown({
			windowMs: 60 * 1000 * 5,
			delayMs: 1500
		})
	)
	app.use(cronjob())
	if (process.env.NODE_ENV !== 'production') {
		app.use(morgan('dev'))
	}
}
