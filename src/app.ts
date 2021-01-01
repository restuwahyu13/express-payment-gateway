import express, { Express } from 'express'
import { pluginMiddleware } from './middlewares/middleware.plugin'
import { routeMiddleware } from './middlewares/middleware.route'

const app: Express = express()
pluginMiddleware(app)
routeMiddleware(app)

export default app
