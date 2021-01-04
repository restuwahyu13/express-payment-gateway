import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.createTable('saldo_history', (table: Knex.TableBuilder) => {
		table.increments('saldo_history_id').primary()
		table
			.integer('topup_id')
			.references('topup_id')
			.inTable('topups')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable()
		table.bigInteger('balance').notNullable()
		table.timestamp('created_at').defaultTo(null)
		table.timestamp('updated_at').defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.dropTable('saldo')
}
