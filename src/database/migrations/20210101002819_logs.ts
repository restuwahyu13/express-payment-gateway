import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.createTable('logs', (table: Knex.TableBuilder) => {
		table.increments('log_id').primary()
		table
			.integer('user_id')
			.references('user_id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable()
		table.string('log_status').notNullable()
		table.dateTime('log_time').notNullable()
		table.timestamp('created_at').defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.dropTable('logs')
}
