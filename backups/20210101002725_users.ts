import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.createTable('users', (table: Knex.TableBuilder) => {
		table.increments('user_id').primary()
		table.string('email').unique().notNullable()
		table.string('password').notNullable()
		table.string('photo').defaultTo('default.jpeg')
		table.boolean('active').defaultTo(false)
		table.string('role').defaultTo('user')
		table.bigInteger('noc_transfer').notNullable().defaultTo(0)
		table.dateTime('first_login').defaultTo(null)
		table.dateTime('last_login').defaultTo(null)
		table.timestamp('created_at').defaultTo(null)
		table.timestamp('updated_at').defaultTo(null)
	})
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
	await knex.schema.dropTable('users')
}
