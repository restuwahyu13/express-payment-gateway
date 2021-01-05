import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.createTable('saldo', (table: Knex.TableBuilder) => {
		table.increments('saldo_id').primary()
		table
			.integer('user_id')
			.references('user_id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable()
		table.bigInteger('total_balance').notNullable()
		table.bigInteger('withdraw_amount').defaultTo(0)
		table.dateTime('withdraw_time').defaultTo(null)
		table.timestamp('created_at').defaultTo(null)
		table.timestamp('updated_at').defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.dropTable('saldo')
}
