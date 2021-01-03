import moment, { Moment } from 'moment'
export const dateFormat = (date: Date): Moment => moment(date, moment.locale('id'))
