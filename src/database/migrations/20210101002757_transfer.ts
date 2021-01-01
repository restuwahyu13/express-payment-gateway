import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.createTable('transfer', (table: Knex.TableBuilder) => {
		table.increments('transfer_id').primary()
		table
			.integer('from_user_id')
			.references('user_id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
		table.integer('to_user_id').references('user_id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
		table.bigInteger('amount').defaultTo(0)
		table.timestamp('created_at').defaultTo(null)
		table.timestamp('updated_at').defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.dropTable('transfer')
}
