import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.createTable('withdraw', (table: Knex.TableBuilder) => {
		table.increments('withdraw_id').primary()
		table
			.integer('user_id')
			.references('user_id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable()
		table.bigInteger('withdraw_amount').notNullable()
		table.dateTime('withdraw_time').notNullable()
		table.timestamp('created_at').defaultTo(null)
		table.timestamp('updated_at').defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.dropTable('withdraw')
}
