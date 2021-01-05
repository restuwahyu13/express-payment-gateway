import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.createTable('transfer', (table: Knex.TableBuilder) => {
		table.increments('transfer_id').primary()
		table
			.integer('transfer_from')
			.references('user_id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable()
		table
			.integer('transfer_to')
			.references('user_id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable()
		table.bigInteger('transfer_amount').notNullable().defaultTo(0)
		table.dateTime('transfer_time').notNullable()
		table.timestamp('created_at').defaultTo(null)
		table.timestamp('updated_at').defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.dropTable('transfer')
}
