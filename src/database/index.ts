import knexFile from '../../knexfile'
import knex from 'knex'
const { development } = require('../../knexfile')

export default knex(knexFile.development)
