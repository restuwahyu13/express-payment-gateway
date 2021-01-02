import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.createTable('logs', (table: Knex.TableBuilder) => {
		table.increments('logs_id').primary()
		table.integer('user_id').references('user_id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
		table.string('logs_status').defaultTo(null)
		table.dateTime('logs_time').defaultTo(null)
		table.timestamp('created_at').defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.dropTable('logs')
}
