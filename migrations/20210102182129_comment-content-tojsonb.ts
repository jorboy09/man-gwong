import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw('ALTER TABLE comments ALTER COLUMN content TYPE jsonb using to_jsonb(content);')
    await knex.schema.alterTable('comments',(table)=>{
        table.integer("no_of_likes").defaultTo(0).nullable().alter()
    })

}


export async function down(knex: Knex): Promise<void> {
    await knex.raw('ALTER TABLE comments ALTER COLUMN content TYPE text;')
    await knex.schema.alterTable('comments',(table)=>{
        table.integer("no_of_likes").notNullable().alter()
    })
}

