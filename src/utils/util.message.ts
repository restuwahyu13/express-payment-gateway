import { EventEmitter } from 'events'
import { Response } from 'express'
const events = new EventEmitter()

interface IMessage {
	response: Response
	method: string
	statusCode: number
	message: string
}

export const message = async (rest: IMessage): Promise<boolean> => {
	const { response, method, statusCode, message } = rest
	events.once('msg', () => response.status(statusCode).json({ status: statusCode, method, message }))
	return events.emit('msg')
}
