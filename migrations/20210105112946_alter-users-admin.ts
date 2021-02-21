import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users',(table)=>{
        table.boolean('admin').defaultTo(0).alter();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('users', (table)=>{
        table.integer('admin').alter();
    })
}

