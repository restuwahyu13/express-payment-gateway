import http, { Server } from 'http'
import app from './src/app'

const server: Server = http.createServer(app)
server.listen(process.env.PORT, (): void => console.log(`server is running on port ${process.env.PORT}`))
