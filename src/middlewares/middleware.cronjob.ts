import { Request, Response, NextFunction } from 'express'
import { RecurrenceRule, scheduleJob } from 'node-schedule'
import knex from '../database'
import { LogsDTO } from '../dto/dto.logs'

export const cronjob = () => (req: Request, res: Response, next: NextFunction): void => {
	const rules = new RecurrenceRule()
	rules.date = 1
	rules.month = 6
	rules.year = new Date().getFullYear()

	scheduleJob(
		rules,
		async (): Promise<void> => {
			const deleteAllLogs: number = await knex<LogsDTO>('logs')
				.whereRaw(`TIMESTAMP(log_time) < ${new Date().getFullYear()}-06-01`)
				.delete()
			if (deleteAllLogs > 0) next()
		}
	)

	next()
}
