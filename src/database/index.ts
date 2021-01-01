const { development } = require('../../knexfile')
import knexFile from '../../knexfile'
import knex from 'knex'

export default knex(knexFile.development)
