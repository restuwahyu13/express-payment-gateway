import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.createTable('topups', (table: Knex.TableBuilder) => {
		table.increments('topup_id').primary()
		table
			.integer('user_id')
			.references('user_id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable()
		table.string('topup_no').notNullable()
		table.bigInteger('topup_amount').notNullable()
		table.string('topup_method').notNullable()
		table.dateTime('topup_time').notNullable()
		table.timestamp('created_at').defaultTo(null)
		table.timestamp('updated_at').defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.dropTable('topups')
}
